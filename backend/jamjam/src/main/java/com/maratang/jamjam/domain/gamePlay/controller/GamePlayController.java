package com.maratang.jamjam.domain.gamePlay.controller;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.maratang.jamjam.domain.gamePlay.dto.request.play.GameNextRoundReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.play.GamePlayReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.play.GameStartReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.round.GameRoundCreateReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.round.GameRoundUpdateReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.session.GameSessionCreateReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.session.GameSessionResultResetReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.session.GameSessionResultUpdateReq;
import com.maratang.jamjam.domain.gamePlay.dto.response.play.GameNextRoundRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.round.GameRoundCreateRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.round.GameRoundStationRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.session.GameSessionIdRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.session.GameSessionRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.session.GameSessionUpdateRes;
import com.maratang.jamjam.domain.gamePlay.service.GamePlayService;
import com.maratang.jamjam.domain.gamePlay.service.GameRoundService;
import com.maratang.jamjam.domain.gamePlay.service.GameSessionService;
import com.maratang.jamjam.global.ws.BroadCastService;
import com.maratang.jamjam.global.ws.BroadCastType;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class GamePlayController {

	private final GamePlayService gamePlayService;
	private final GameSessionService gameSessionService;
	private final GameRoundService gameRoundService;
	private final BroadCastService broadCastService;

	// 게임 설정값 저장
	@MessageMapping("/game/session.setting")
	@Operation(summary = "✨ 새로운 게임 세션을 생성한다.", description = "미팅룸 방장이 정한 게임 설정값으로 게임 세션을 생성한다.")
	public void createGameSession(@Payload GameSessionCreateReq gameSessionReq, UUID roomUUID){
		GameSessionRes res = gameSessionService.createGameSession(gameSessionReq, roomUUID);
		broadCastService.broadcastToRoom(roomUUID, res, BroadCastType.GAME_SESSION_READY);
	}

	// 라운드 설정
	@MessageMapping("/game/round.setting")
	@Operation(summary = "✨ 라운드 정보를 저장한다.", description = "게임 세션에서 진행될 라운드를 생성한다.")
	public void createGameRound(@Payload GameRoundCreateReq req, UUID roomUUID){
		GameRoundCreateRes res = gameRoundService.createGameRound(req);
		gamePlayService.createGameRound(res.getGameRoundUUID(), req.getGameId());
		broadCastService.broadcastToRoom(roomUUID, res, BroadCastType.GAME_READY);
	}

	// 게임 시작하기
	@MessageMapping("/game/round.start")
	@Operation(summary = "✨ 게임 시작하기")
	public void startNewGame(@Payload GameStartReq gameStartReq, UUID roomUUID) {
        gamePlayService.startNewGame(gameStartReq, roomUUID);
    }

	// 게임 답 입력
	@MessageMapping("/game/round.play")
	@Operation(summary = "✨ 게임을 진행한다")
    public void playGame(@Payload GamePlayReq gamePlayReq, UUID roomUUID, UUID attendeeUUID) {
        gamePlayService.playGame(gamePlayReq, roomUUID, attendeeUUID);
    }

	@MessageMapping("/game/round.station")
	@Operation(summary = "✨ 라운드 승자가 역을 선택한다.", description = "라운드가 끝났을 때 승자가 선택한 역을 저장한다.")
	public void updateRoundStation(@Payload GameRoundUpdateReq gameRoundUpdateReq, UUID roomUUID) {
		GameRoundStationRes res = gameRoundService.updateRoundRecord(gameRoundUpdateReq);
		broadCastService.broadcastToRoom(roomUUID, res, BroadCastType.GAME_CENTER_UPDATE);
	}

	@MessageMapping("/game/round.next")
	@Operation(summary = "✨ 다음 라운드로 이동", description = "다음 라운드로 넘어간다.")
	public void nextRound(@Payload GameNextRoundReq gameNextRoundReq, UUID roomUUID) {
        GameNextRoundRes res = gameRoundService.nextRound(gameNextRoundReq, roomUUID);
        broadCastService.broadcastToRoom(roomUUID, res, BroadCastType.GAME_NEXT_ROUND);
    }

	@MessageMapping("/game/session.station")
	@Operation(summary = "✨ 게임 결과 반영", description = "모든 라운드가 끝나고 결정된 역을 모임 장소로 선택한다.")
	public void updateSessionStation(@Payload GameSessionResultUpdateReq gameSessionResultUpdateReq, UUID roomUUID){
		GameSessionUpdateRes res = gameSessionService.updateGameSession(gameSessionResultUpdateReq);
		broadCastService.broadcastToRoom(roomUUID, res, BroadCastType.GAME_RESULT_APPLY);
	}

	@MessageMapping("/game/session.reset")
	@Operation(summary = "✨ 게임 결과 리셋", description = "모든 라운드가 끝나고 결정된 역을 모임 장소로 택하지 않는다.")
	public void resetGame(@Payload GameSessionResultResetReq req, UUID roomUUID) {
		GameSessionIdRes res = gameSessionService.updateGameSessionStatus(req.getGameSessionUUID());
		// gameRoundService.updateRoundRecord(gameRoundUpdateReq);
		broadCastService.broadcastToRoom(roomUUID, res, BroadCastType.GAME_RESET);
	}
}
