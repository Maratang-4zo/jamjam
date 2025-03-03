package com.maratang.jamjam.global.ws;

import java.util.Map;
import java.util.UUID;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;

import com.maratang.jamjam.domain.room.service.RoomService;
import com.maratang.jamjam.global.auth.room.RoomTokenManager;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenClaims;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

	@Lazy private final RoomService roomService;
	private final RoomTokenManager roomTokenManager;

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

		switch (accessor.getCommand()) {
			case CONNECT -> handleConnectCommand(accessor);
			case SUBSCRIBE -> handleSubscribeCommand(accessor);
			case UNSUBSCRIBE -> handleDisconnectCommand(accessor);
			case DISCONNECT -> handleDisconnectCommand(accessor);
			case null, default -> {
			}
		}
		return message;
	}


	void handleConnectCommand(StompHeaderAccessor accessor){
		// 연결시 토큰 검증
		String token = accessor.getSessionAttributes().get("roomToken").toString();
		RoomJwtTokenClaims claims = roomTokenManager.getUUIDs(token);

		Map<String ,Object> attributes =  accessor.getSessionAttributes();
		attributes.put("roomUUID", claims.getRoomUUID());
		attributes.put("attendeeUUID", claims.getAttendeeUUID());
		accessor.setSessionAttributes(attributes);
		System.out.println("connect");
	}


	public void handleSubscribeCommand(StompHeaderAccessor accessor){
		if("/user/sub/errors".equals(accessor.getDestination())){
			return;
		}

		// 1. UUID 정보 추출
		UUID attendeeUUID = (UUID)accessor.getSessionAttributes().get("attendeeUUID");
		UUID roomUUID = (UUID)accessor.getSessionAttributes().get("roomUUID");

		if(accessor.getDestination() == null){
			throw new BusinessException(ErrorCode.INVALID_ROOM_UUID);
		}

		if(accessor.getDestination().startsWith("/sub/rooms/")){
			if(!roomUUID.toString().equals(accessor.getDestination().substring("/sub/rooms/".length()))){
				throw new BusinessException(ErrorCode.INVALID_ROOM_UUID);
			}
		}

		// 2. 유효한 방이면 입장 요청
		roomService.enterRoom(roomUUID, attendeeUUID);

		Map<String ,Object> attributes =  accessor.getSessionAttributes();
		attributes.put("status", "entered");
		accessor.setSessionAttributes(attributes);
		System.out.println("subscribe");
	}

	public void handleDisconnectCommand(StompHeaderAccessor accessor){
		if(!"leaved".equals(accessor.getSessionAttributes().get("status"))){
			// 사용자가 떠난다. => 중간 탈주 / 최종 모임 장소 결정
			UUID attendeeUUID = (UUID)accessor.getSessionAttributes().get("attendeeUUID");
			UUID roomUUID = (UUID)accessor.getSessionAttributes().get("roomUUID");

			// 사용자 나감 처리
			roomService.leaveRoom(roomUUID, attendeeUUID);

			Map<String ,Object> attributes =  accessor.getSessionAttributes();
			attributes.put("status", "leaved");
			accessor.setSessionAttributes(attributes);
		}
		System.out.println("disconnect or unsubscribe");
	}


}
