package com.maratang.jamjam.domain.room.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.backup.board.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.attendee.dto.response.AttendeeInfo;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.entity.AttendeeStatus;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.randomName.entity.Name;
import com.maratang.jamjam.domain.randomName.entity.Nick;
import com.maratang.jamjam.domain.randomName.repository.NameRepository;
import com.maratang.jamjam.domain.randomName.repository.NickRepository;
import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.dto.response.RoomGetRes;
import com.maratang.jamjam.domain.room.dto.response.RoomRes;
import com.maratang.jamjam.domain.room.dto.response.RootLeaveRes;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.entity.RoomStatus;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.auth.room.RoomTokenProvider;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenClaims;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.map.station.SubwayDataLoader;
import com.maratang.jamjam.global.map.station.SubwayInfo;
import com.maratang.jamjam.global.ws.BroadCastService;
import com.maratang.jamjam.global.ws.BroadCastType;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {
	private final BroadCastService broadCastService;
	private final RoomRepository roomRepository;
	private final AttendeeRepository attendeeRepository;
	private final NickRepository nickRepository;
	private final NameRepository nameRepository;
	private final SubwayDataLoader subwayDataLoader;
	private final RoomTokenProvider roomTokenProvider;

	// 방 정보 받기
	public RoomGetRes findRoom(UUID roomUUID, UUID attendeeUUID) {
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		if (room.isRoomClosed()) {
			throw new BusinessException(ErrorCode.ROOM_NOT_OPEN_FOUND);
		}

		room.getAttendees().stream()
			.filter(a -> a.getAttendeeUUID().equals(attendeeUUID))
			.findFirst()
			.orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));

		SubwayInfo roomCenterStart = subwayDataLoader.getSubwayInfo(room.getStartStation());

		return RoomGetRes.of(room, attendeeUUID, roomCenterStart);
	}

	// 방 존재 유무 확인
	public RoomRes isRoomExist(UUID roomUUID, HttpServletRequest request){
		Room room = roomRepository.findByRoomUUID(roomUUID).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		boolean hasToken = false;
		// todo: fix.....
		try{
			String token = roomTokenProvider.resolveToken(request);
			if(token != null){
				Claims claims = roomTokenProvider.getTokenClaims(token);
				if(roomUUID.toString().equals(claims.get("roomUUID"))){
					hasToken = true;
				}
			}
		} catch (Exception ignored){
		}


		return RoomRes.of(room, hasToken);
	}

	// 방 만들기
	@Transactional
	public RoomJwtTokenClaims createRoom(RoomCreateReq roomCreateReq) {
		Room room = roomCreateReq.toEntity();
		Attendee attendee = Attendee.builder().nickname(roomCreateReq.getNickname()).build();

		room.updateAttendee(attendee);

		String roomName = attendee.getNickname();

		if (roomName == null || roomName.isBlank()){
			//todo 여기서 nick 테이블에 잇는 모든 value 중에 랜덤 값으로 정하기
			Nick nick = nickRepository.findRandomNick();
			Name name = nameRepository.findRandomName();
			roomName = nick.getNick() + name.getName();
		}

		roomName = roomName + "님의 방";

		room.updateName(roomName);

		attendee.updateRoom(room);

		attendeeRepository.save(attendee);
		roomRepository.save(room);

		return RoomJwtTokenClaims.of(room, attendee);
	}

	// 방 정보 변경
	@Transactional
	public void updateRoom(UUID roomUUID, RoomUpdateReq roomUpdateReq) {
		// 1. DB 상태 변경
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		room.updateRoom(roomUpdateReq);

		// 2. 참여자들에게 알리기
		broadCastService.broadcastToRoom(roomUUID, roomUpdateReq, BroadCastType.ROOM_INFO_UPDATE);
	}


	// 방 입장
	@Transactional
	public void enterRoom(UUID roomUUID, UUID attendeeUUID) {
		// 정원 초과는 아직 고려 안 함

		// 1. 활성화된 방인지, 유효한 유저인지, 방-유저 매칭이 되는지
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
		if (room.isRoomClosed()) {
			throw new BusinessException(ErrorCode.ROOM_CANNOT_ENTER);
		}

		// 2. 참여자 유효성 검사
		Attendee attendee = attendeeRepository.findByAttendeeUUIDAndRoom(attendeeUUID, room)
			.orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));


		attendee.updateStatus(AttendeeStatus.ENTERED);
		attendeeRepository.save(attendee);

		// 3. 기존 인원들에게 알림
		AttendeeInfo attendeeInfo = AttendeeInfo.of(attendee);
		broadCastService.broadcastToRoom(roomUUID, attendeeInfo, BroadCastType.ROOM_ENTER);

		// 1-1. 나갔다 온 방장이니?
		if(room.getRoomStatus() == RoomStatus.RESERVED && room.getEstimatedForceCloseAt().isAfter(LocalDateTime.now()) && room.getRoot().getAttendeeUUID() == attendeeUUID){
			room.updateStatus(RoomStatus.ONGOING);
			roomRepository.save(room);
			broadCastService.broadcastToRoom(roomUUID, attendeeInfo, BroadCastType.ROOM_ROOT_REENTRY);
		}
	}

	@Transactional
	public void leaveRoom(UUID roomUUID, UUID attendeeUUID) {
		// 1. 현재 접속중인 사람 목록에서 제거한다.
		Attendee attendee = attendeeRepository.findByAttendeeUUID(attendeeUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));
		attendee.updateStatus(AttendeeStatus.EXITED);
		attendeeRepository.save(attendee);

		// 2. 참여자가 떠남을 알리기
		AttendeeInfo attendeeInfo = AttendeeInfo.of(attendee);
		broadCastService.broadcastToRoom(roomUUID, attendeeInfo, BroadCastType.ROOM_LEAVE);

		// 3. 방장
		// 3-1. 모임 결정 완료) 다른 사람들도 DONE 표시하고 로비로 모셔다드리기
		// 3-2. 모임 결정 미완료) 다른 사람들을 내쫓기
		Room room = roomRepository.findByRoomUUID(roomUUID).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
		if(room.getRoot().getAttendeeUUID().equals(attendeeUUID)){
			room.updateForceClose(LocalDateTime.now().plusMinutes(5));
			roomRepository.save(room);
			broadCastService.broadcastToRoom(roomUUID, RootLeaveRes.of(room, attendee), BroadCastType.ROOM_ROOT_LEAVE);
		}
	}

	@Transactional
	public void closeRoom(UUID roomUUID, UUID attendeeUUID) {
		// 정상 종료
		// 1. DB 상태 변경
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		if (!room.getRoot().getAttendeeUUID().equals(attendeeUUID)) {
			throw new BusinessException(ErrorCode.FORBIDDEN);
		}

		// 2. 남은 참여자 쫓아내기
		room.updateStatus(RoomStatus.FINISHED);
		roomRepository.save(room);

		broadCastService.broadcastToRoom(roomUUID, "쫓겨나랏!!", BroadCastType.ROOM_CLOSE);
	}

	public void updateAttendeeInfo(UUID roomUUID, AttendeeUpdateReq attendeeUpdateReq) {
		// 1. DB 상태 변경
		// 2. 참여자들에게 알리기
		broadCastService.broadcastToRoom(roomUUID, "", BroadCastType.ATTENDEE_UPDATE);
	}



}

