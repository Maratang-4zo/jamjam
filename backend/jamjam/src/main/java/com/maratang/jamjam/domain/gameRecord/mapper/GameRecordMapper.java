package com.maratang.jamjam.domain.gameRecord.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.gameRecord.dto.request.GameRecordCreateReq;
import com.maratang.jamjam.domain.gameRecord.dto.request.GameRecordUpdateReq;
import com.maratang.jamjam.domain.gameRecord.entity.GameRecord;
import com.maratang.jamjam.domain.gameRecord.entity.GameRecordStatus;

@Mapper(componentModel = "spring")
public interface GameRecordMapper {

	GameRecordMapper INSTANCE = Mappers.getMapper(GameRecordMapper.class);

	@Mapping(source = "roomUUID", target = "room.roomUUID")
	GameRecord gameRecordCreateReqToGameRecord(GameRecordCreateReq gameRecordCreateReq);

	@Mapping(source = "req.finalStationName", target = "finalStationName")
	@Mapping(source = "req.gameRecordStatus", target = "gameRecordStatus")
	GameRecord updateGameRecord(GameRecordUpdateReq req, GameRecord gameRecord);

	@Mapping(source = "updateGameRecordStatus", target = "gameRecordStatus")
	GameRecord updateGameRecordStatus(GameRecordStatus updateGameRecordStatus, GameRecord gameRecord);

}
