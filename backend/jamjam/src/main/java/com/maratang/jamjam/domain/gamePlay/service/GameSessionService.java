package com.maratang.jamjam.domain.gamePlay.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.gamePlay.dto.request.session.GameSessionCreateReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.session.GameSessionReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.session.GameSessionResultUpdateReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.session.GameSessionUpdateReq;
import com.maratang.jamjam.domain.gamePlay.dto.response.session.GameSessionRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.session.GameSessionUpdateRes;
import com.maratang.jamjam.domain.gamePlay.entity.GameSession;
import com.maratang.jamjam.domain.gamePlay.entity.GameSessionStatus;
import com.maratang.jamjam.domain.gamePlay.mapper.GameSessionMapper;
import com.maratang.jamjam.domain.gamePlay.repository.GameSessionRepository;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GameSessionService {

	private final GameSessionMapper gameSessionMapper;
	private final GameSessionRepository gameSessionRepository;
	private final RoomRepository roomRepository;

	@Transactional
	public GameSessionRes createGameSession(GameSessionReq gameSessionReq, UUID roomUUID){

		GameSessionCreateReq gameSessionCreateReq = GameSessionCreateReq.builder()
			.roomUUID(roomUUID)
			.roundCnt(gameSessionReq.getRoundCnt())
			.finalStationName(gameSessionReq.getFinalStationName())
			.gameSessionStatus(GameSessionStatus.PLAYING)
			.build();
		GameSession gameSession = gameSessionMapper.INSTANCE.gameRecordCreateReqToGameRecord(gameSessionCreateReq);
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(()-> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		gameSession.updateRoom(room);
		GameSession gameSessionSaved = gameSessionRepository.save(gameSession);

		GameSessionRes gameSessionRes = GameSessionRes.builder()
			.gameSessionUUID(gameSessionSaved.getGameSessionUUID())
			.roundCnt(gameSessionSaved.getRoundCnt())
			.build();

		return gameSessionRes;
	}

	@Transactional
	public GameSessionUpdateRes updateGameSession(GameSessionResultUpdateReq req){
		GameSessionUpdateReq gameSessionUpdateReq = GameSessionUpdateReq.builder()
			.gameSessionStatus(GameSessionStatus.SUCCESS)
			.finalStationName(req.getFinalStationName())
			.build();
		GameSession gameSession = gameSessionRepository.findByGameSessionUUID(req.getGameSessionUUID())
			.orElseThrow(()-> new BusinessException(ErrorCode.GAMERECORD_NOT_FOUND));
		GameSession gameSession1 = gameSessionMapper.INSTANCE.updateGameRecord(gameSessionUpdateReq, gameSession);
		gameSessionRepository.save(gameSession1);
		return GameSessionUpdateRes.builder().gameSessionUUID(req.getGameSessionUUID()).finalStationName(req.getFinalStationName()).build();
	}

	@Transactional
	public void updateGameSessionStatus(UUID gameSessionUUID){
		GameSession gameSession = gameSessionRepository.findByGameSessionUUID(gameSessionUUID)
			.orElseThrow(()-> new BusinessException(ErrorCode.GAMERECORD_NOT_FOUND));
		GameSession gameSession1 = gameSessionMapper.updateGameRecordStatus(GameSessionStatus.NOTUSES, gameSession);
		gameSessionRepository.save(gameSession1);
	}

}
