package com.maratang.jamjam.domain.room.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class RoomCreateReq {
	@NotBlank
	private String purpose;
	@NotBlank
	private LocalDateTime meetingDate;
	private String nickname;
}
