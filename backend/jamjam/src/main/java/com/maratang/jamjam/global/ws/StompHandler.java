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

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

	@Lazy private final RoomService roomService;

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

		switch (accessor.getCommand()) {
			case CONNECT -> handleConnectCommand(accessor);
			case DISCONNECT -> handleDisconnectCommand(accessor);
			case SUBSCRIBE -> handleSubscribeCommand(accessor);
			case null, default -> {
			}
		}
		return message;
	}


	void handleConnectCommand(StompHeaderAccessor accessor){
		// 소켓 connect 요청이 오면 JWT 토큰에 대한 검증 로직을 실행한다.
		// => 였으나 일단 토큰 X UUID받기만

		String attendeeUUID = accessor.getFirstNativeHeader("attendeeUUID");
		String roomUUID = accessor.getFirstNativeHeader("roomUUID");

		Map<String ,Object> attributes =  accessor.getSessionAttributes();
		attributes.put("roomUUID", roomUUID);
		attributes.put("attendeeUUID", attendeeUUID);
		accessor.setSessionAttributes(attributes);
	}


	public void handleSubscribeCommand(StompHeaderAccessor accessor){
		// ** JWT 토큰 상세 검증 로직을 실행한다.

		// 1. 일단 토큰 X 정보 추출
		UUID attendeeUUID = UUID.fromString(accessor.getFirstNativeHeader("attendeeUUID"));
		UUID roomUUID = UUID.fromString(accessor.getFirstNativeHeader("roomUUID"));

		// 2. 유효한 방이면 입장 요청
		// 3. 구독자들에게 새로운 참여자 브로드캐스팅
		roomService.enterRoom(roomUUID, attendeeUUID);
	}

	public void handleDisconnectCommand(StompHeaderAccessor accessor){
		// 사용자가 떠난다. => 중간 탈주 / 최종 모임 장소 결정
		UUID attendeeUUID = UUID.fromString((String)accessor.getSessionAttributes().get("attendeeUUID"));
		UUID roomUUID = UUID.fromString((String)accessor.getSessionAttributes().get("roomUUID"));

		// 사용자 나감 처리
		roomService.leaveRoom(roomUUID, attendeeUUID);
	}


}
