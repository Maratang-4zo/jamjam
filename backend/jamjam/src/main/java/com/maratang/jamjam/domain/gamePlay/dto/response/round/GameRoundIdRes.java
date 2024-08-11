package com.maratang.jamjam.domain.gamePlay.dto.response.round;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameRoundIdRes {
	private UUID gameRoundUUID;

	public static GameRoundIdRes of(UUID gameRoundUUID) {
		return GameRoundIdRes.builder()
                .gameRoundUUID(gameRoundUUID)
                .build();
	}
}
