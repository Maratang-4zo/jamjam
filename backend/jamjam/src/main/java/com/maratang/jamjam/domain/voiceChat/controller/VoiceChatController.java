package com.maratang.jamjam.domain.voiceChat.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/wr/rooms")
@RequiredArgsConstructor
public class VoiceChatController {

	private final VoiceChatService voiceChatService;

	@PostMapping
	@Operation(summary = "방장이 음성 채팅 방을 생성한다.")
	public ResponseEntity<?> initializeSession(@RequestBody VoiceChatSessionReq params) {
		VoiceChatSessionRes voiceChatSessionRes = voiceChatService.initVoiceChatSession(params);
		return ResponseEntity.status(HttpStatus.CREATED).body(voiceChatSessionRes);
	}

	@PostMapping("/token")
	@Operation(summary = "음성 채팅방에 들어가기 위한 토큰을 발급받는다.")
	public ResponseEntity<?> createConnection(@RequestBody VoiceChatTokenReq params) {
		VoiceChatTokenRes voiceChatTokenRes = voiceChatService.createConnection(params);
		return ResponseEntity.status(HttpStatus.CREATED).body(voiceChatTokenRes);
	}
}
