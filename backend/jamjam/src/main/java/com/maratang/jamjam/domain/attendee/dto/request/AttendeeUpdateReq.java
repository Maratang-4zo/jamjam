package com.maratang.jamjam.domain.attendee.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AttendeeUpdateReq {
	@NotBlank
	private UUID attendeeUUID;

	@NotBlank
	private Double lat;

	@NotBlank
	private Double lon;

	@NotBlank
	private String address;
}
