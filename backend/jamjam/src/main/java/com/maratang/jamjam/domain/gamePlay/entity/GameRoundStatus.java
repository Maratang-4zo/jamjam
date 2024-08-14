package com.maratang.jamjam.domain.gamePlay.entity;

import lombok.Getter;

@Getter
public enum GameRoundStatus {
	PLAYING("게임 진행중"),
	SUCCESS("정상적 종료"),
	ABORTED("비정상 종료");
	private final String desc;

	GameRoundStatus(String desc) {
		this.desc = desc;
	}
}
