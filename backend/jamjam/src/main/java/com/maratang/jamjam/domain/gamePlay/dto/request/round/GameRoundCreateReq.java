package com.maratang.jamjam.domain.gamePlay.dto.request.round;

import java.util.UUID;

import lombok.Getter;

@Getter
public class GameRoundCreateReq {
    private Integer round;
    private Long gameId;
    private UUID gameSessionUUID;
    private String stationName;
}
