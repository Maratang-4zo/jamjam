package com.maratang.jamjam.domain.chat.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.chat.dto.request.ChatReq;
import com.maratang.jamjam.domain.chat.dto.response.ChatRes;
import com.maratang.jamjam.domain.chat.entity.Chat;
import com.maratang.jamjam.domain.chat.mapper.ChatMapper;
import com.maratang.jamjam.domain.chat.repository.ChatRepository;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor_ = {@Lazy})
public class ChatService {

	private final RoomRepository roomRepository;
	private final ChatRepository chatRepository;
	private final AttendeeRepository attendeeRepository;
	@Lazy
	private final SimpMessagingTemplate simpMessagingTemplate;
	private final String ROOM_SUBSCRIBE_DEST = "/sub/rooms/";

	private static final ChatMapper mapper = ChatMapper.INSTANCE;

	@Transactional
	public void sendMessage(UUID roomUUID, UUID attendeeUUID, ChatReq chatReq) {
		Room room = roomRepository.findByRoomUUID(roomUUID).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
		Attendee attendee = attendeeRepository.findByAttendeeUUID(attendeeUUID).orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));
		// member
		Chat chat = mapper.chatReqToChat(chatReq, room, attendee);
		chatRepository.save(chat);

		ChatRes res = ChatRes.builder()
			.attendeeUUID(attendeeUUID).content(chatReq.getContent()).createdAt(chat.getCreatedAt())
			.build();
		// chat to chatReq
		simpMessagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST + roomUUID, res, Map.of("type", "CHAT_RECEIVED"));
	}
}
