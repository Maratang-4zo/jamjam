package com.maratang.jamjam.domain.game.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.game.dto.response.GameInfoRes;
import com.maratang.jamjam.domain.game.service.GameInfoService;


import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
public class GameInfoController {

	private final GameInfoService gameInfoService;

	@GetMapping
	@Operation(summary = "게임 정보", description = "게임 정보를 호출한다.")
	public ResponseEntity<?> createGameRecord(HttpServletRequest request, HttpServletResponse response) {
		List<GameInfoRes> gameList = gameInfoService.getGameInfoList();
		return ResponseEntity.ok().body(gameList);
	}

}
