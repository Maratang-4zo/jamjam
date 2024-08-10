package com.maratang.jamjam.domain.gamePlay.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.gamePlay.dto.request.round.GameRoundCreateReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.round.GameRoundUpdateReq;
import com.maratang.jamjam.domain.gamePlay.entity.GameRound;

@Mapper
public interface GameRoundMapper {
    GameRoundMapper INSTANCE = Mappers.getMapper(GameRoundMapper.class);

    GameRound roundRecordCreateReqToRoundRecord(GameRoundCreateReq gameRoundCreateReq);

    GameRound roundRecordUpdateReqToRoundRecord(GameRoundUpdateReq gameRoundUpdateReq);
}
