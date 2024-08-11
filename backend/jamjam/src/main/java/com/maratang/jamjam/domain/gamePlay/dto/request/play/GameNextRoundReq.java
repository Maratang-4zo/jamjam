package com.maratang.jamjam.domain.gamePlay.dto.request.play;

import java.util.UUID;

import lombok.Getter;

@Getter
public class GameNextRoundReq {
	private UUID gameRoundUUID;
	private int currentRound;
	private int totalRound;
}
