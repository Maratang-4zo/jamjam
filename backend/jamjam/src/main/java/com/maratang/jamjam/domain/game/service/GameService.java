package com.maratang.jamjam.domain.game.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.maratang.jamjam.domain.game.dto.request.GameAnswerReq;
import com.maratang.jamjam.domain.game.dto.request.GameSettingReq;
import com.maratang.jamjam.domain.game.repository.GameRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameService {
	private final GameRepository gameRepository;

	public void setNewGame(GameSettingReq gameSettingReq) {
		// 미팅룸 게임 설정값 저장하기
	}

	public void startNewGame(UUID roomId) {
		// 새로운 게임 시작
		// 게임 종료 및 승자 선정
		// 승자가 움직일 수 있는 범위 설정

	}

	public void answerGameQuestion(UUID roomId, GameAnswerReq gameAnswerReq) {
		// 게임 결과 수신
	}

	public void resetGame(Long roomId) {
		// 게임 리셋
	}
}
