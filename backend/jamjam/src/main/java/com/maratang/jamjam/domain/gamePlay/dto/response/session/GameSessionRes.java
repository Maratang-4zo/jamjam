package com.maratang.jamjam.domain.gamePlay.dto.response.session;

import java.util.UUID;

import com.maratang.jamjam.domain.gamePlay.entity.GameSession;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameSessionRes {
	private UUID gameSessionUUID;
	private Integer roundCnt;

	public static GameSessionRes of(GameSession gameSession){
		return GameSessionRes.builder()
                .gameSessionUUID(gameSession.getGameSessionUUID())
                .roundCnt(gameSession.getRoundCnt())
                .build();
	}
}
