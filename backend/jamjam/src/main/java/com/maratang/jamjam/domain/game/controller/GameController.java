package com.maratang.jamjam.domain.game.controller;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.maratang.jamjam.domain.game.dto.request.GameAnswerReq;
import com.maratang.jamjam.domain.game.dto.request.GameSettingReq;
import com.maratang.jamjam.domain.game.service.GameService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class GameController {

	private final GameService gameService;

	// 게임 설정값 저장
	@MessageMapping("/{roomUUID}/game/setting")
	public void setNewGame(@DestinationVariable UUID UUID, @Payload GameSettingReq gameSettingReq){
		// 세팅값 따로 저장되나???? create???
		gameService.setNewGame(gameSettingReq);
	}

	// 게임 시작하기
	@MessageMapping("/{roomId}/game/start")
	public void startNewGame(@DestinationVariable UUID roomUUID) {
        gameService.startNewGame(roomUUID);
    }

	// 게임 답 입력
	@MessageMapping("/{roomId}/game/answer")
    public void answerGameQuestion(@DestinationVariable UUID roomUUID, @Payload GameAnswerReq gameAnswerReq) {
        gameService.answerGameQuestion(roomUUID, gameAnswerReq);
    }

	@MessageMapping("/{roomId}/game/reset")
	public void resetGame(@DestinationVariable Long roomId) {
        gameService.resetGame(roomId);
    }
}
