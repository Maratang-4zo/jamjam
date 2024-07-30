package com.maratang.jamjam.domain.room.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.maratang.jamjam.domain.board.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomEnterReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.mapper.AttendeeMapper;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.mapper.RoomMapper;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenCliams;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {
	private final SimpMessagingTemplate messagingTemplate;
	private final String ROOM_SUBSCRIBE_DEST = "/sub/rooms/{roomId}";
	private final RoomRepository roomRepository;
	private final AttendeeRepository attendeeRepository;

	@Transactional
	public RoomJwtTokenCliams createRoom(RoomCreateReq roomCreateReq) {
		Room room = RoomMapper.INSTANCE.roomCreateReqToAttendee(roomCreateReq);
		Attendee attendee = AttendeeMapper.INSTANCE.attendeeCreateReqToAttendee(roomCreateReq.getNickname(), room);

		room.updateAttendee(attendee);

		attendeeRepository.save(attendee);
		roomRepository.save(room);

		UUID roomUUID = room.getRoomUUID();

		RoomJwtTokenCliams roomJwtTokenCliams = RoomJwtTokenCliams.builder()
			.roomUUID(roomUUID)
			.attendeeUUID(attendee.getAttendeeUUID())
			.build();

		return roomJwtTokenCliams;
	}

	@Transactional
	public void updateRoom(RoomUpdateReq roomUpdateReq) {
		// 1. DB 상태 변경
		// 2. 참여자들에게 알리기
		Room room = roomRepository.findById(roomUpdateReq.getRoomId())
				.orElseThrow(()->new BusinessException(ErrorCode.RO_NOT_VALID_ROOM));

		room.updateRoom(roomUpdateReq);
	}

	public void enterRoom(Long roomId, RoomEnterReq enterRequest) {
		// 1. 미팅룸 유효성 검사
		// 2. 닉네임, 출발지 등 입력하는 시점 확인 필요
		// 3. 기존 참여자들에게 입장 알림
		// 4. 새 참여자에게는 현재 참여자 목록 알려주기

		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST, enterRequest.getNickname()+"입장");
		messagingTemplate.convertAndSendToUser("userUUID", "", null);
	}

	public void leaveRoom(Long roomId) {
		// 1. DB 상태 변경
		// 2. 참여자가 떠남을 알리기
		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST, "누가 나옴");
	}

	public void closeRoom(Long roomId) {
		// 1. DB 상태 변경
		// 2. 남은 참여자 쫓아내기
	}

	public void updateAttendeeInfo(Long roomId, AttendeeUpdateReq attendeeUpdateReq) {
		// 1. DB 상태 변경
		// 2. 참여자들에게 알리기
		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST, "");
}
