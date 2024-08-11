package com.maratang.jamjam.domain.gamePlay.dto.response.round;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameRoundResultListRes {
    List<GameRoundResultRes> gameRoundResultResList;
}
