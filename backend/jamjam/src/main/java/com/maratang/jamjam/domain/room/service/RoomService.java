package com.maratang.jamjam.domain.room.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.dto.AttendeeDTO;
import com.maratang.jamjam.domain.attendee.dto.response.AttendeeInfo;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.entity.AttendeeStatus;
import com.maratang.jamjam.domain.attendee.mapper.AttendeeMapper;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.board.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomCloseReq;
import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.dto.response.RoomGetRes;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.entity.RoomStatus;
import com.maratang.jamjam.domain.room.mapper.RoomMapper;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.middle.GeometryUtils;
import com.maratang.jamjam.global.middle.GrahamScan;
import com.maratang.jamjam.global.middle.HaversineDistance;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenClaims;
import com.maratang.jamjam.global.station.Point;
import com.maratang.jamjam.global.station.SubwayDataLoader;
import com.maratang.jamjam.global.station.SubwayInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Lazy})
@Transactional(readOnly = true)
public class RoomService {
	@Lazy private final SimpMessagingTemplate messagingTemplate;
	private final String ROOM_SUBSCRIBE_DEST = "/sub/rooms/";
	private final RoomRepository roomRepository;
	private final AttendeeRepository attendeeRepository;
	private final GrahamScan grahamScan;
	private final GeometryUtils geometryUtils;
	private final SubwayDataLoader subwayDataLoader;

	@Transactional
	public RoomJwtTokenClaims createRoom(RoomCreateReq roomCreateReq) {
		Room room = RoomMapper.INSTANCE.roomCreateReqToAttendee(roomCreateReq);

		Attendee attendee = AttendeeMapper.INSTANCE.attendeeCreateReqToAttendee(roomCreateReq);

		room.updateAttendee(attendee);

		attendeeRepository.save(attendee);
		roomRepository.save(room);

		attendee.updateRoom(room);

		UUID roomUUID = room.getRoomUUID();

		RoomJwtTokenClaims roomJwtTokenClaims = RoomJwtTokenClaims.builder()
			.roomUUID(roomUUID)
			.attendeeUUID(attendee.getAttendeeUUID())
			.build();

		return roomJwtTokenClaims;
	}

	@Transactional
	public void updateRoom(UUID roomUUID, RoomUpdateReq roomUpdateReq) {
		// 1. DB 상태 변경
		// 2. 참여자들에게 알리기
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		room.updateRoom(roomUpdateReq);
	}

	public SubwayInfo getMiddleStation(UUID roomUUID) {
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		// Transforming attendees' coordinates into Point instances, skipping null values
		List<Point> points = room.getAttendees().stream()
			.filter(attendee -> attendee.getLat() != null && attendee.getLon() != null)
			.map(attendee -> new Point(attendee.getLat(), attendee.getLon()))
			.collect(Collectors.toList());

		List<Point> grahamPoints = grahamScan.convexHull(points);

		Point centroid = geometryUtils.calculateCentroid(grahamPoints);

		Map<String, SubwayInfo> subwayMap = subwayDataLoader.getSubwayInfoMap();

		double searchRadius = 5.0; // 5km
		short stationCnt = 5;

		SubwayInfo nearbyStations = HaversineDistance.findNearbyStations(subwayMap, centroid.getX(),
			centroid.getY(), searchRadius,stationCnt);

		return nearbyStations;
	}

	@Transactional
	public void enterRoom(UUID roomUUID, UUID attendeeUUID) {
		// 정원 초과는 아직 고려 안 함

		// 1. 활성화된 방인지, 유효한 유저인지, 방-유저 매칭이 되는지
		Room room = roomRepository.findByRoomUUID(roomUUID).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
		if (room.getRoomStatus() == RoomStatus.ABORTED || room.getRoomStatus() == RoomStatus.FINISHED) {
			throw new BusinessException(ErrorCode.ROOM_CANNOT_ENTER);
		}

		// 2. 참여자 유효성 검사
		Attendee attendee = attendeeRepository.findByAttendeeUUIDAndRoom(attendeeUUID, room).orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));
		attendee.updateStatus(AttendeeStatus.ENTERED);
		attendeeRepository.save(attendee);

		// 3. 기존 인원들에게 알림
		AttendeeInfo attendeeInfo = AttendeeMapper.INSTANCE.attendeeToAttendeeInfo(attendee);
		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST+roomUUID, attendeeInfo, Map.of("type", "ROOM_ENTER"));
	}


	public void leaveRoom(UUID roomUUID, UUID attendeeUUID) {
		// 1. 현재 접속중인 사람 목록에서 제거한다.
		Attendee attendee = attendeeRepository.findByAttendeeUUID(attendeeUUID).orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));
		attendee.updateStatus(AttendeeStatus.EXITED);
		attendeeRepository.save(attendee);

		// 2. 참여자가 떠남을 알리기
		AttendeeInfo attendeeInfo = AttendeeMapper.INSTANCE.attendeeToAttendeeInfo(attendee);
		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST + roomUUID, attendeeInfo, Map.of("type", "ROOM_LEAVE"));

		// 3. 방장
		// 3-1. 모임 결정 완료) 다른 사람들도 DONE 표시하고 로비로 모셔다드리기
		// 3-2. 모임 결정 미완료) 다른 사람들을 내쫓기
		Room room = roomRepository.findByRoomUUID(roomUUID).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
		if(room.getRoot().getAttendeeUUID().equals(attendeeUUID)){
			closeRoom(roomUUID, attendeeUUID, null);
		}
	}

	public void closeRoom(UUID roomUUID, UUID attendeeUUID, RoomCloseReq roomCloseReq) {
		// 1. DB 상태 변경
		Room room = roomRepository.findByRoomUUID(roomUUID).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		if(!room.getRoot().getAttendeeUUID().equals(attendeeUUID)){
			throw new BusinessException(ErrorCode.FORBIDDEN);
		}

		// 2. 남은 참여자 쫓아내기
		room.updateStatus(RoomStatus.FINISHED);
		if(roomCloseReq != null){
			room.updateStation(roomCloseReq.getStation());
		}
		roomRepository.save(room);

		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST + roomUUID, "쫓겨나랏!!", Map.of("type", "ROOM_CLOSE"));

	}

	public void updateAttendeeInfo(UUID roomUUID, AttendeeUpdateReq attendeeUpdateReq) {
		// 1. DB 상태 변경
		// 2. 참여자들에게 알리기
		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST, "", Map.of("type", "ATTENDEE_UPDATE"));
	}

	public RoomGetRes findRoom(UUID roomUUID) {
		Room room = roomRepository.findByRoomUUID(roomUUID)
				.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		if (room.getRoomStatus() == RoomStatus.FINISHED || room.getRoomStatus() == RoomStatus.ABORTED){
            throw new BusinessException(ErrorCode.ROOM_NOT_OPEN_FOUND);
		}

		List<Attendee> attendees = attendeeRepository.findAllByRoomId(room.getRoomId());
		List<AttendeeDTO> attendeeList = AttendeeDTO.of(attendees);

		String startStation = room.getStartStation();

		SubwayInfo roomCenterStart = subwayDataLoader.getSubwayInfo(startStation);

		return RoomGetRes.builder()
			.RoomUUID(roomUUID)
			.roomName(room.getName())
			.roomCenterStart(roomCenterStart)
			.roomTime(room.getMeetingDate())
			.roomPurpose(room.getPurpose())
			.hostUUID(room.getRoomUUID())
			.attendees(attendeeList)
			.build();
	}
}
