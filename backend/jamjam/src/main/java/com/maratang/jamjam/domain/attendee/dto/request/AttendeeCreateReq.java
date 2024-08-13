package com.maratang.jamjam.domain.attendee.dto.request;

import com.maratang.jamjam.domain.attendee.entity.Attendee;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AttendeeCreateReq {
	private String nickname;

	public Attendee toEntity() {
		return Attendee.builder()
			.nickname(nickname)
			.build();
	}
}
