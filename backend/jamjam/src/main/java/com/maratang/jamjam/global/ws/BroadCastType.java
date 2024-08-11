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
	ATTENDEE_UPDATE("참여자 정보 수정"),
	GAME_SESSION_READY("게임 세션 활성화"),
	GAME_COUNTDOWN("게임 카운트다운"),
	GAME_READY("게임 준비"),
	GAME_START("게임 시작"),
	GAME_PLAY("게임 플레이 데이터"),
	GAME_END("게임 종료"),
	GAME_WINNER("게임 승자"),
	GAME_RESET("게임 리셋"),
	GAME_CENTER_UPDATE("라운드 역 선택"),
	GAME_RESULT_APPLY("최종 역 선택");

	private final String desc;
}
