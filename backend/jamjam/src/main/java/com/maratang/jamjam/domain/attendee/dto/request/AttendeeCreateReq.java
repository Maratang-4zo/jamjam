package com.maratang.jamjam.domain.attendee.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AttendeeCreateReq {
	@NotBlank
	private Long roomId;
	private String nickname;
}
