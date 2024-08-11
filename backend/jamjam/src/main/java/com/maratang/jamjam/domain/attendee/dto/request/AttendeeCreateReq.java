package com.maratang.jamjam.domain.attendee.dto.request;

import com.maratang.jamjam.domain.attendee.entity.Attendee;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AttendeeCreateReq {
	@NotBlank
	private String nickname;

	public Attendee toEntity() {
		return Attendee.builder()
			.nickname(nickname)
			.build();
	}
}
