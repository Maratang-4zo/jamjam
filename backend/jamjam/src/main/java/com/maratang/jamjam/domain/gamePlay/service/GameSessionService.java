package com.maratang.jamjam.domain.gamePlay.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.gamePlay.dto.request.session.GameSessionCreateReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.session.GameSessionResultUpdateReq;
import com.maratang.jamjam.domain.gamePlay.dto.response.session.GameSessionIdRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.session.GameSessionRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.session.GameSessionUpdateRes;
import com.maratang.jamjam.domain.gamePlay.entity.GameSession;
import com.maratang.jamjam.domain.gamePlay.entity.GameSessionStatus;
import com.maratang.jamjam.domain.gamePlay.repository.GameSessionRepository;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.entity.RoomStatus;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GameSessionService {

	private final GameSessionRepository gameSessionRepository;
	private final RoomRepository roomRepository;

	@Transactional
	public GameSessionRes createGameSession(GameSessionCreateReq gameSessionCreateReq, UUID roomUUID){
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(()-> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		GameSession gameSession = gameSessionCreateReq.toEntity(room);

		GameSession gameSessionSaved = gameSessionRepository.save(gameSession);
		room.updateStatus(RoomStatus.PLAYING);
		roomRepository.save(room);
		return GameSessionRes.of(gameSessionSaved);
	}

	@Transactional
	public GameSessionUpdateRes updateGameSession(GameSessionResultUpdateReq req){
		GameSession gameSession = gameSessionRepository.findByGameSessionUUID(req.getGameSessionUUID())
			.orElseThrow(()-> new BusinessException(ErrorCode.GAMERECORD_NOT_FOUND));

		gameSession.updateFinalStationName(req.getFinalStationName());

		gameSessionRepository.save(gameSession);
		return GameSessionUpdateRes.of(gameSession);
	}

	@Transactional
	public GameSessionIdRes updateGameSessionStatus(UUID gameSessionUUID){
		GameSession gameSession = gameSessionRepository.findByGameSessionUUID(gameSessionUUID)
			.orElseThrow(()-> new BusinessException(ErrorCode.GAMERECORD_NOT_FOUND));
		gameSession.updateGameSessionStatus(GameSessionStatus.NOTUSES);

		gameSessionRepository.save(gameSession);
		return GameSessionIdRes.of(gameSession);
	}

}
