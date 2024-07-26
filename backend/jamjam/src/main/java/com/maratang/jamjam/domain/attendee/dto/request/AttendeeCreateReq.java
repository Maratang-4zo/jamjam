package com.maratang.jamjam.domain.attendee.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AttendeeCreateReq {
	@NotBlank
	private Long roomId;
	@NotBlank
	private Double lat;
	@NotBlank
	private Double lon;
}
