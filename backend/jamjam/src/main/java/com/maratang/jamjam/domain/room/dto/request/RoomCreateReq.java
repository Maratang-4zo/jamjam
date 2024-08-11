package com.maratang.jamjam.domain.room.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RoomCreateReq {
	@NotBlank
	private String purpose;
	@NotBlank
	private LocalDateTime meetingDate;
	private String nickname;
}
