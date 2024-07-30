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
@RequiredArgsConstructor
public class ChatService {

	private final RoomRepository roomRepository;
	private final ChatRepository chatRepository;
	private final SimpMessagingTemplate simpMessagingTemplate;

	private static final ChatMapper mapper = ChatMapper.INSTANCE;

	public void sendMessage(Long roomId, ChatReq chatReq) {
		// Room room = roomRepository.findById(roomId).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
		// member
		// Chat chat = mapper.chatReqToChat(chatReq, room);
		// chatRepository.save(chat);

		ChatRes  res = ChatRes.builder().nickname(chatReq.getNickname()).content(chatReq.getContent()).type("CHAT_RECEIVED").build();
		// chat to chatReq
		simpMessagingTemplate.convertAndSend("/sub/rooms/" + roomId, res);
	}
}
