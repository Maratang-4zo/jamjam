package com.maratang.jamjam.domain.gamePlay.dto.request.session;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameSessionResultUpdateReq {
	@NotBlank
	private String finalStationName;
	private UUID gameSessionUUID;
}
