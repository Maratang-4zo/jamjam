package com.maratang.jamjam.domain.attendee.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AttendeeCreateReq {
	@NotBlank
	private UUID roomUUID;
	private String nickname;
}
