package com.maratang.jamjam.domain.gamePlay.dto.request.round;

import java.util.UUID;

import lombok.Getter;

@Getter
public class GameRoundUpdateReq {
    private UUID gameRoundUUID;
    private String roundStationName;
}
