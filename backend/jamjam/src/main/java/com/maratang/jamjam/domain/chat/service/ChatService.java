package com.maratang.jamjam.domain.chat.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.maratang.jamjam.domain.chat.dto.request.ChatReq;
import com.maratang.jamjam.domain.chat.dto.response.ChatRes;
import com.maratang.jamjam.domain.chat.mapper.ChatMapper;
import com.maratang.jamjam.domain.chat.repository.ChatRepository;
import com.maratang.jamjam.domain.room.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Lazy})
public class ChatService {

	private final RoomRepository roomRepository;
	private final ChatRepository chatRepository;
	private final AttendeeRepository attendeeRepository;
	@Lazy private final SimpMessagingTemplate simpMessagingTemplate;
	private final String ROOM_SUBSCRIBE_DEST = "/sub/rooms/";

	private static final ChatMapper mapper = ChatMapper.INSTANCE;

	public void sendMessage(UUID roomUUID, UUID attendeeUUID, ChatReq chatReq) {
		Room room = roomRepository.findByRoomUUID(roomUUID).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
		Attendee attendee = attendeeRepository.findByAttendeeUUID(attendeeUUID).orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));
		// member
		Chat chat = mapper.chatReqToChat(chatReq, room, attendee);
		chatRepository.save(chat);

		ChatRes res = ChatRes.builder().attendeeUUID(attendeeUUID).content(chatReq.getContent()).type("CHAT_RECEIVED").build();
		// chat to chatReq
		simpMessagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST + roomUUID, res);
	}
}
