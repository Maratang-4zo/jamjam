package com.maratang.jamjam.domain.attendee.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AttendeeUpdateReq {
	@NotBlank
	private Double lat;

	@NotBlank
	private Double lon;

	@NotBlank
	private String address;
}
