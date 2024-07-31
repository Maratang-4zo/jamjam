package com.maratang.jamjam.domain.chat.controller;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.maratang.jamjam.domain.chat.dto.request.ChatReq;
import com.maratang.jamjam.domain.chat.service.ChatService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {

	private final ChatService chatService;

	@MessageMapping("/{roomUUID}/chat/send")
	@Operation(summary = "🚗 구현 중")
	public void sendMessage(@DestinationVariable UUID roomUUID, @Payload ChatReq chatReq) {
		chatService.sendMessage(roomUUID, chatReq);
    }
}
