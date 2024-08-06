package com.maratang.jamjam.global.ws;

import java.util.Map;
import java.util.UUID;

import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Lazy})
public class BroadCastService {
	@Lazy private final SimpMessagingTemplate messagingTemplate;
	private final String ROOM_SUBSCRIBE_DEST = "/sub/rooms/";

	public void broadcastToRoom(UUID roomUUID, Object message, BroadCastType type) {
		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST + roomUUID, message, Map.of("type", type));
	}
}
