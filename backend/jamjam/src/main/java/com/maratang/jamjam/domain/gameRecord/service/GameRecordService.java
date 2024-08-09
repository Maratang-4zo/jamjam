package com.maratang.jamjam.domain.gameRecord.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.gameRecord.dto.request.GameRecordCreateReq;
import com.maratang.jamjam.domain.gameRecord.dto.request.GameRecordReq;
import com.maratang.jamjam.domain.gameRecord.dto.request.GameRecordResultUpdateReq;
import com.maratang.jamjam.domain.gameRecord.dto.request.GameRecordUpdateReq;
import com.maratang.jamjam.domain.gameRecord.dto.response.GameRecordRes;
import com.maratang.jamjam.domain.gameRecord.entity.GameRecord;
import com.maratang.jamjam.domain.gameRecord.entity.GameRecordStatus;
import com.maratang.jamjam.domain.gameRecord.mapper.GameRecordMapper;
import com.maratang.jamjam.domain.gameRecord.repository.GameRecordRepository;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GameRecordService {

	private final GameRecordMapper gameRecordMapper;
	private final GameRecordRepository gameRecordRepository;
	private final RoomRepository roomRepository;

	@Transactional
	public GameRecordRes createGameRecord(GameRecordReq gameRecordReq){

		GameRecordCreateReq gameRecordCreateReq = GameRecordCreateReq.builder()
			.roomUUID(gameRecordReq.getRoomUUID())
			.roundCnt(gameRecordReq.getRoundCnt())
			.finalStationName(gameRecordReq.getFinalStationName())
			.gameRecordStatus(GameRecordStatus.PLAYING)
			.build();
		GameRecord gameRecord = gameRecordMapper.INSTANCE.gameRecordCreateReqToGameRecord(gameRecordCreateReq);
		Room room = roomRepository.findByRoomUUID(gameRecordReq.getRoomUUID())
			.orElseThrow(()-> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		gameRecord.updateRoom(room);
		GameRecord gameRecordSaved = gameRecordRepository.save(gameRecord);

		GameRecordRes gameRecordRes = GameRecordRes.builder()
			.gameRecordUUID(gameRecordSaved.getGameRecordUUID())
			.build();

		return gameRecordRes;
	}

	@Transactional
	public void updateGameRecord(UUID gamerecordUUID, GameRecordResultUpdateReq gameRecordResultUpdateEndReq){
		GameRecordUpdateReq gameRecordUpdateReq = GameRecordUpdateReq.builder()
			.gameRecordStatus(GameRecordStatus.SUCCESS)
			.finalStationName(gameRecordResultUpdateEndReq.getFinalStationName())
			.build();
		GameRecord gameRecord = gameRecordRepository.findByUUID(gamerecordUUID)
			.orElseThrow(()-> new BusinessException(ErrorCode.GAMERECORD_NOT_FOUND));
		GameRecord gameRecord1 = gameRecordMapper.INSTANCE.updateGameRecord(gameRecordUpdateReq, gameRecord);
		gameRecordRepository.save(gameRecord1);
	}

	@Transactional
	public void updateGameRecordStatus(UUID gamerecordUUID){
		GameRecord gameRecord = gameRecordRepository.findByUUID(gamerecordUUID)
			.orElseThrow(()-> new BusinessException(ErrorCode.GAMERECORD_NOT_FOUND));
		GameRecord gameRecord1 = gameRecordMapper.updateGameRecordStatus(GameRecordStatus.NOTUSES, gameRecord);
		gameRecordRepository.save(gameRecord1);
	}

}
