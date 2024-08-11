package com.maratang.jamjam.domain.gamePlay.gameEngine;

import java.util.UUID;

import com.maratang.jamjam.domain.gamePlay.dto.request.play.GamePlayReq;
import com.maratang.jamjam.domain.gamePlay.dto.response.play.GamePlayRes;

public interface GameEngine {
	void initialize();
	void startGame();
	GamePlayRes play(GamePlayReq req, UUID attendeeUUID);
	boolean isWinner(Object parameter);
	void endGame(UUID roomUUID, UUID winnerUUID);
}
