package com.maratang.jamjam.domain.attendee.entity;

import lombok.Getter;

@Getter
public enum AttendeeStatus {
	CREATED("생성"),
	ENTERED("입장"),
	WAITING("대기중"),
	EXITED("퇴장");

	private final String desc;

	AttendeeStatus(String desc) {
		this.desc = desc;
	}
}
