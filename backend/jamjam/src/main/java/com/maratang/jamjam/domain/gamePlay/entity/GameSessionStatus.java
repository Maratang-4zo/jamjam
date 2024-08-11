package com.maratang.jamjam.domain.gamePlay.entity;

import lombok.Getter;

@Getter
public enum GameSessionStatus {
	PLAYING("게임 진행중"),
	SUCCESS("정상적 종료"),
	NOTUSES("사용 안함");

	private final String desc;

	GameSessionStatus(String desc) {
		this.desc = desc;
	}
}
