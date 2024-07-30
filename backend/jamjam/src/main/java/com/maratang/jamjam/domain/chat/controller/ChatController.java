package com.maratang.jamjam.domain.chat.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.maratang.jamjam.domain.chat.dto.request.ChatReq;
import com.maratang.jamjam.domain.chat.service.ChatService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {

	private final ChatService chatService;

	@MessageMapping("/{roomId}/chat/send")
	public void sendMessage(@DestinationVariable Long roomId, @Payload ChatReq chatReq) {
		chatService.sendMessage(roomId, chatReq);
    }
}
