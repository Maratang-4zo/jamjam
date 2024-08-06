package com.maratang.jamjam.domain.gameRecord.entity;

import lombok.Getter;

@Getter
public enum GameRecordStatus {
	PLAYING("게임 진행중"),
	SUCCESS("정상적 종료"),
	NOTUSES("사용 안함");

	private final String desc;

	GameRecordStatus(String desc) {
		this.desc = desc;
	}
}
