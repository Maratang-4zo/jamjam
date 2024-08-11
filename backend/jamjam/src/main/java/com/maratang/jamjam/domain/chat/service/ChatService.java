package com.maratang.jamjam.domain.chat.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.chat.dto.request.ChatReq;
import com.maratang.jamjam.domain.chat.dto.response.ChatRes;
import com.maratang.jamjam.domain.chat.entity.Chat;
import com.maratang.jamjam.domain.chat.repository.ChatRepository;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.ws.BroadCastService;
import com.maratang.jamjam.global.ws.BroadCastType;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ChatService {

	private final RoomRepository roomRepository;
	private final ChatRepository chatRepository;
	private final AttendeeRepository attendeeRepository;
	private final BroadCastService broadCastService;

	@Transactional
	public void sendMessage(UUID roomUUID, UUID attendeeUUID, ChatReq chatReq) {
		Room room = roomRepository.findByRoomUUID(roomUUID).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
		Attendee attendee = attendeeRepository.findByAttendeeUUID(attendeeUUID).orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));
		// member
		Chat chat = chatReq.toEntity(room, attendee);
		chatRepository.save(chat);

		ChatRes res = ChatRes.of(chat);
		// chat to chatReq
		broadCastService.broadcastToRoom(roomUUID, res, BroadCastType.CHAT_RECEIVED);
	}
}
