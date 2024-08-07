package com.maratang.jamjam.domain.chat.controller;

import java.util.UUID;

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

	@MessageMapping("/chat/send")
	@Operation(summary = "채팅을 전송한다.")
	public void sendMessage(UUID roomUUID, UUID attendeeUUID, @Payload ChatReq chatReq) {
		chatService.sendMessage(roomUUID, attendeeUUID, chatReq);
    }
}
