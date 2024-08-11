package com.maratang.jamjam.domain.gamePlay.dto.response.round;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameRoundCreateRes {
	private UUID gameRoundUUID;

	public static GameRoundCreateRes of(UUID gameRoundUUID) {
		return GameRoundCreateRes.builder()
                .gameRoundUUID(gameRoundUUID)
                .build();
	}
}
