package com.maratang.jamjam.domain.attendee.dto.request;

import com.maratang.jamjam.domain.attendee.entity.Attendee;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AttendeeCreateReq {
	private String nickname;

	public Attendee toEntity() {
		return Attendee.builder()
			.nickname(nickname)
			.build();
	}
}
