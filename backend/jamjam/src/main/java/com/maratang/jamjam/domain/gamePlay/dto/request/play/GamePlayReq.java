package com.maratang.jamjam.domain.gamePlay.dto.request.play;

import java.util.UUID;

import lombok.Getter;

@Getter
public class GamePlayReq {
	UUID gameRoundUUID;
	String data;
}
