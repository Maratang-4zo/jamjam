package com.maratang.jamjam.domain.gamePlay.dto.response.session;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameSessionUpdateRes {
	private UUID gameSessionUUID;
	private String finalStationName;
}
