package com.maratang.jamjam.domain.game.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.game.dto.response.GameInfoRes;
import com.maratang.jamjam.domain.game.service.GameService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
public class GameController {

	private final GameService gameService;

	@GetMapping
	@Operation(summary = "게임 정보", description = "게임 정보를 호출한다.")
	public ResponseEntity<?> createGameRecord() {
		List<GameInfoRes> gameList = gameService.getGameInfoList();
		return ResponseEntity.ok().body(gameList);
	}

}
