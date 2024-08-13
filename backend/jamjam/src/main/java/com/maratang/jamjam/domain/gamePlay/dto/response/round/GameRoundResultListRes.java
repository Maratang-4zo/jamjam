package com.maratang.jamjam.domain.gamePlay.dto.response.round;

import java.util.List;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameRoundResultListRes {
    UUID gameSessionUUID;
    List<GameRoundResultRes> roundRecordList;

    public static GameRoundResultListRes of(List<GameRoundResultRes> gameRoundResultResList, UUID gameSessionUUID) {
        return GameRoundResultListRes.builder()
                .gameSessionUUID(gameSessionUUID)
               .roundRecordList(gameRoundResultResList)
               .build();
    }
}
