package com.maratang.jamjam.domain.gamePlay.dto.response.play;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameCountdown {
	private UUID gameRoundUUID;
	private int countdown;
}
