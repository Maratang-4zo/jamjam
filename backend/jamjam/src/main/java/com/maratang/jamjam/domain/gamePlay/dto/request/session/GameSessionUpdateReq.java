package com.maratang.jamjam.domain.gamePlay.dto.request.session;

import com.maratang.jamjam.domain.gamePlay.entity.GameSessionStatus;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GameSessionUpdateReq {
	private String finalStationName;
	private GameSessionStatus gameSessionStatus;
}
