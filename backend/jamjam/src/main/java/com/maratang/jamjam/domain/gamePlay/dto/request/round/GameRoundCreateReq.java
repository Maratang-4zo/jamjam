package com.maratang.jamjam.domain.gamePlay.dto.request.round;

import java.util.UUID;

import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.domain.gamePlay.entity.GameRound;
import com.maratang.jamjam.domain.gamePlay.entity.GameSession;

import lombok.Getter;

@Getter
public class GameRoundCreateReq {
    private Integer round;
    private Long gameId;
    private UUID gameSessionUUID;
    private String stationName;

    public GameRound toEntity(Game game, GameSession session){
        return GameRound.builder()
                .round(round)
                .game(game)
                .gameSession(session)
                .stationName(stationName)
                .build();
    }
}
