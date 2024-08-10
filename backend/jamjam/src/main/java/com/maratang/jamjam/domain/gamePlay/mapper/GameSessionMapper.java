package com.maratang.jamjam.domain.gamePlay.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.gamePlay.dto.request.session.GameSessionCreateReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.session.GameSessionUpdateReq;
import com.maratang.jamjam.domain.gamePlay.entity.GameSession;
import com.maratang.jamjam.domain.gamePlay.entity.GameSessionStatus;

@Mapper(componentModel = "spring")
public interface GameSessionMapper {

	GameSessionMapper INSTANCE = Mappers.getMapper(GameSessionMapper.class);

	@Mapping(source = "roomUUID", target = "room.roomUUID")
	GameSession gameRecordCreateReqToGameRecord(GameSessionCreateReq gameSessionCreateReq);

	@Mapping(source = "req.finalStationName", target = "finalStationName")
	@Mapping(source = "req.gameSessionStatus", target = "gameSessionStatus")
	GameSession updateGameRecord(GameSessionUpdateReq req, GameSession gameSession);

	@Mapping(source = "updateGameSessionStatus", target = "gameSessionStatus")
	GameSession updateGameRecordStatus(GameSessionStatus updateGameSessionStatus, GameSession gameSession);

}
