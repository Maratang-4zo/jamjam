package com.maratang.jamjam.domain.room.entity;

import lombok.Getter;

@Getter
public enum RoomStatus {
	CREATED("미팅룸생성"),
	ONGOING("미팅룸진행중"),
	PLAYING("게임중"),
	RESERVED("보류"),
	ABORTED("미팅룸중단"),
	FINISHED("미팅룸종료");

	private final String desc;

	RoomStatus(String desc) {
		this.desc = desc;
	}
}
