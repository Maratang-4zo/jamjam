package com.maratang.jamjam.domain.gamePlay.dto.request.session;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class GameSessionReq {
	@NotBlank
	private Integer roundCnt;
	private String finalStationName;
}
