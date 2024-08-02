package com.maratang.jamjam.global.ws;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BroadCastType {
	CHAT_RECEIVED("채팅 전송"),
	ROOM_ENTER("미팅룸 입장"),
	ROOM_LEAVE("미팅룸 퇴장"),
	ROOM_CLOSE("미팅룸 종료"),
	ATTENDEE_UPDATE("참여자 정보 수정");

	private final String desc;
}
