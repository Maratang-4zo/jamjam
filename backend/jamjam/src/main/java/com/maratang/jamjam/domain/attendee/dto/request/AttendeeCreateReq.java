package com.maratang.jamjam.domain.attendee.dto.request;

import com.maratang.jamjam.domain.attendee.entity.Attendee;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AttendeeCreateReq {
	private String nickname;

	public Attendee toEntity() {
		return Attendee.builder()
			.nickname(nickname)
			.build();
	}
}
