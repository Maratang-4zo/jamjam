package com.maratang.jamjam.domain.attendee.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AttendeeUpdateReq {
	@NotBlank
	private Long attendeeId;

	@NotBlank
	private Double lat;

	@NotBlank
	private Double lon;

	@NotBlank
	private String address;
}
