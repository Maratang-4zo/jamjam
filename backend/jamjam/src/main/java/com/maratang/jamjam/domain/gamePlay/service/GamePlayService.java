package com.maratang.jamjam.domain.gamePlay.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.gamePlay.dto.request.play.GamePlayReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.play.GameStartReq;
import com.maratang.jamjam.domain.gamePlay.dto.response.play.GameCountdown;
import com.maratang.jamjam.domain.gamePlay.dto.response.play.GamePlayRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.round.GameRoundIdRes;
import com.maratang.jamjam.domain.gamePlay.entity.GameRound;
import com.maratang.jamjam.domain.gamePlay.gameEngine.GameEngine;
import com.maratang.jamjam.domain.gamePlay.gameEngine.GameFactory;
import com.maratang.jamjam.domain.gamePlay.repository.GameRoundRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.ws.BroadCastService;
import com.maratang.jamjam.global.ws.BroadCastType;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GamePlayService {
	private final GameRoundRepository gameRoundRepository;
	private final BroadCastService broadCastService;
	private final AttendeeRepository attendeeRepository;

	private final GameFactory gameFactory;

	public void createGameRound(UUID gameRoundUUID, Long gameId) {
		GameEngine game = gameFactory.createGame(gameId, gameRoundUUID);
		game.initialize();
	}

	public void startNewGame(GameStartReq gameStartReq, UUID roomUUID){
		GameEngine game = gameFactory.getGame(gameStartReq.getGameRoundUUID());

		if(game == null){
			throw new BusinessException(ErrorCode.INVALID_GAME_ROUND);
		}

		game.startGame();

		for (int i = 3; i > 0; i--) {
			broadCastService.broadcastToRoom(roomUUID, GameCountdown.of(gameStartReq.getGameRoundUUID(), i), BroadCastType.GAME_COUNTDOWN);
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				Thread.currentThread().interrupt();
			}
		}
		broadCastService.broadcastToRoom(roomUUID, GameRoundIdRes.of(gameStartReq.getGameRoundUUID()), BroadCastType.GAME_START);
	}

	public void playGame(GamePlayReq req, UUID roomUUID, UUID attendeeUUID){
		GameEngine game = gameFactory.getGame(req.getGameRoundUUID());

		if(game == null){
			return;
			// throw new BusinessException(ErrorCode.INVALID_GAME_ROUND);
		}

		GamePlayRes result = game.play(req, attendeeUUID);

		broadCastService.broadcastToRoom(roomUUID, result, BroadCastType.GAME_PLAY);

		if (result.isGameEnded() && result.getWinnerUUID().equals(result.getAttendeeUUID())) {
			endGame(roomUUID, result);
		}
	}


	@Transactional
	public void endGame(UUID roomUUID, GamePlayRes res){
		GameEngine game = gameFactory.getGame(res.getGameRoundUUID());
		if(game == null){
			throw new BusinessException(ErrorCode.INVALID_GAME_ROUND);
		}
		game.endGame(roomUUID, res.getWinnerUUID());

		GameRound gameRound = gameRoundRepository.findByGameRoundUUID(res.getGameRoundUUID()).orElseThrow(() -> new BusinessException(ErrorCode.GAME_ROUND_NOT_FOUND));
		Attendee winner = attendeeRepository.findByAttendeeUUID(res.getWinnerUUID()).orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));
		gameRound.updateWinner(winner);
		gameRoundRepository.save(gameRound);

		gameFactory.removeGame(res.getGameRoundUUID());

		broadCastService.broadcastToRoom(roomUUID, res, BroadCastType.GAME_END);
		broadCastService.broadcastToRoom(roomUUID, res, BroadCastType.GAME_WINNER);
	}


}
