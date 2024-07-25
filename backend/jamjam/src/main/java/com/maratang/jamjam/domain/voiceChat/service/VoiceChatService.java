package com.maratang.jamjam.domain.voiceChat.service;

import org.springframework.stereotype.Service;

import com.maratang.jamjam.domain.voiceChat.dto.request.VoiceChatSessionReq;
import com.maratang.jamjam.domain.voiceChat.dto.request.VoiceChatTokenReq;
import com.maratang.jamjam.domain.voiceChat.dto.response.VoiceChatSessionRes;
import com.maratang.jamjam.domain.voiceChat.dto.response.VoiceChatTokenRes;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoiceChatService {
	private final OpenVidu openviduClient;

	public VoiceChatSessionRes initVoiceChatSession(VoiceChatSessionReq params) {
		// SessionProperties properties = SessionProperties.fromJson(params).build();
		// params: customSessionId, title(?)
		SessionProperties properties = new SessionProperties.Builder().build();
		Session session;
		try {
			session = openviduClient.createSession(properties);
		} catch (OpenViduException e) {
			throw new BusinessException(ErrorCode.OV_CANNOT_CREATE_SESSION);
		}

		return VoiceChatSessionRes.builder().sessionId(session.getSessionId()).build();
	}

	public VoiceChatTokenRes createConnection(String sessionId, VoiceChatTokenReq params) {
		Session session = openviduClient.getActiveSession(sessionId);

		if (session == null) {
			throw new BusinessException(ErrorCode.OV_SESSION_NOT_FOUND);
		}

		// ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
		// params: nickname, station(?)
		ConnectionProperties properties = new ConnectionProperties.Builder().build();

		Connection connection;
		try {
			connection = session.createConnection(properties);
		} catch (OpenViduException e) {
			throw new BusinessException(ErrorCode.OV_CANNOT_CREATE_CONNECTION);
		}

		return VoiceChatTokenRes.builder().token(connection.getToken()).build();
	}
}
