package com.maratang.jamjam.domain.gamePlay.dto.response.session;

import java.util.UUID;

import com.maratang.jamjam.domain.gamePlay.entity.GameSession;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameSessionIdRes {
	private UUID gameSessionUUID;

	public static GameSessionIdRes of(GameSession gameSession) {
        return GameSessionIdRes.builder()
                .gameSessionUUID(gameSession.getGameSessionUUID())
			    .build();
    }
}
