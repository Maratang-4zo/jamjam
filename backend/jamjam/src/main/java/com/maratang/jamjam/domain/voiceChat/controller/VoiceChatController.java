package com.maratang.jamjam.domain.voiceChat.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.voiceChat.dto.request.VoiceChatSessionReq;
import com.maratang.jamjam.domain.voiceChat.dto.request.VoiceChatTokenReq;
import com.maratang.jamjam.domain.voiceChat.dto.response.VoiceChatSessionRes;
import com.maratang.jamjam.domain.voiceChat.dto.response.VoiceChatTokenRes;
import com.maratang.jamjam.domain.voiceChat.service.VoiceChatService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class VoiceChatController {

	private final VoiceChatService voiceChatService;

	@PostMapping
	@Operation(summary = "🚗 구현 중")
	public ResponseEntity<?> initializeSession(@RequestBody(required = false) VoiceChatSessionReq params) {
		// 일단 미팅룸과 음성채팅룸을 분리해서 작업
		VoiceChatSessionRes voiceChatSessionRes = voiceChatService.initVoiceChatSession(params);
		return ResponseEntity.status(HttpStatus.CREATED).body(voiceChatSessionRes);
	}

	@PostMapping("/{sessionId}/connections")
	@Operation(summary = "🚗 구현 중")
	public ResponseEntity<?> createConnection(@PathVariable("sessionId") String sessionId,
		@RequestBody(required = false) VoiceChatTokenReq params) {
		VoiceChatTokenRes voiceChatTokenRes = voiceChatService.createConnection(sessionId, params);
		return ResponseEntity.status(HttpStatus.OK).body(voiceChatTokenRes);
	}
}
