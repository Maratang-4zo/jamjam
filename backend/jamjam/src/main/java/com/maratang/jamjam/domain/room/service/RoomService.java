package com.maratang.jamjam.domain.room.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.board.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomEnterReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {

	private final RoomRepository roomRepository;
	private final SimpMessagingTemplate messagingTemplate;
	private final String ROOM_SUBSCRIBE_DEST = "/sub/rooms/{roomId}";

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

	public void updateRoom(Long roomId, RoomUpdateReq updateRequest) {
		// 1. DB 상태 변경
		// 2. 참여자들에게 알리기
		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST, "뭐가 업뎃 됨.");
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
}
