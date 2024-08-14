package com.maratang.jamjam.domain.attendee.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.maratang.jamjam.domain.attendee.entity.Attendee;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AttendeeCreateReq {
	private String nickname;

	@JsonCreator
	public AttendeeCreateReq(@JsonProperty("nickname") String nickname) {
		this.nickname = nickname;
	}

	public Attendee toEntity() {
		return Attendee.builder()
			.nickname(nickname)
			.build();
	}
}
