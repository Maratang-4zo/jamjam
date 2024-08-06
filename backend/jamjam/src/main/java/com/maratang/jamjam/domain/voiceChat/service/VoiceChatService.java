package com.maratang.jamjam.domain.voiceChat.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
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
	private final RoomRepository roomRepository;
	private final AttendeeRepository attendeeRepository;

	public VoiceChatSessionRes initVoiceChatSession(UUID roomUUID, UUID attedeeUUID) {
		Room room = roomRepository.findByRoomUUID(roomUUID).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		if(room.isRoomClosed()) {
			throw new BusinessException(ErrorCode.ROOM_CANNOT_ENTER);
		} else if(!room.getRoot().getAttendeeUUID().equals(attedeeUUID)){
			throw new BusinessException(ErrorCode.FORBIDDEN);
		}

		SessionProperties properties = new SessionProperties.Builder().customSessionId(roomUUID.toString()).build();
		Session session;
		try {
			session = openviduClient.createSession(properties);
		} catch (OpenViduException e) {
			throw new BusinessException(ErrorCode.OV_CANNOT_CREATE_SESSION);
		}

		return VoiceChatSessionRes.builder().sessionId(session.getSessionId()).build();
	}

	public VoiceChatTokenRes createConnection(UUID roomUUID, UUID attendeeUUID) {
		Attendee attendee = attendeeRepository.findByAttendeeUUID(attendeeUUID).orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));
		Room room = attendee.getRoom();
		if(!room.getRoomUUID().equals(roomUUID) || room.isRoomClosed()){
			throw new BusinessException(ErrorCode.ROOM_CANNOT_ENTER);
		}

		Session session = openviduClient.getActiveSession(roomUUID.toString());

		if (session == null) {
			throw new BusinessException(ErrorCode.OV_SESSION_NOT_FOUND);
		}

		ConnectionProperties properties = new ConnectionProperties.Builder().data(attendeeUUID.toString()).build();

		Connection connection;
		try {
			connection = session.createConnection(properties);
		} catch (OpenViduException e) {
			throw new BusinessException(ErrorCode.OV_CANNOT_CREATE_CONNECTION);
		}

		return VoiceChatTokenRes.builder().token(connection.getToken()).build();
	}
}
