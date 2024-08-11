package com.maratang.jamjam.domain.gamePlay.dto.response.session;

import java.util.UUID;

import com.maratang.jamjam.domain.gamePlay.entity.GameSession;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameSessionUpdateRes {
	private UUID gameSessionUUID;
	private String finalStationName;

	public static GameSessionUpdateRes of(GameSession gameSession){
		return GameSessionUpdateRes.builder()
                .gameSessionUUID(gameSession.getGameSessionUUID())
                .finalStationName(gameSession.getFinalStationName())
                .build();
	}
}
