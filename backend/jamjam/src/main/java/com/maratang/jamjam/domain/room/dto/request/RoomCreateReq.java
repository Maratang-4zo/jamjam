package com.maratang.jamjam.domain.room.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class RoomCreateReq {
	@NotBlank
	private Long roomId;
	@NotBlank
	private Double lat;
	@NotBlank
	private Double lon;
}
