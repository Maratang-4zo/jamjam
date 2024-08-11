package com.maratang.jamjam.domain.gamePlay.dto.response.play;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameCountdown {
	private UUID gameRoundUUID;
	private int countdown;

	public static GameCountdown of(UUID gameRoundUUID, int countdown) {
		return GameCountdown.builder()
                .gameRoundUUID(gameRoundUUID)
                .countdown(countdown)
                .build();
	}
}
