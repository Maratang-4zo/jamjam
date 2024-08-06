package com.maratang.jamjam.domain.gameRecord.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.gameRecord.dto.request.GameRecordReq;
import com.maratang.jamjam.domain.gameRecord.dto.request.GameRecordResultUpdateReq;
import com.maratang.jamjam.domain.gameRecord.dto.response.GameRecordRes;
import com.maratang.jamjam.domain.gameRecord.service.GameRecordService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/gamerecord/{roomUUID}")
public class GameRecordController {

	private final GameRecordService gameRecordService;

	@PostMapping
	@Operation(summary = "게임 기록 초기 생성", description = "게임 기록를 생성한다.")
	public ResponseEntity<?> createGameRecord(@RequestBody GameRecordReq gameRecordReq, HttpServletResponse httpServletResponse) {
		GameRecordRes gameRecordRes = gameRecordService.createGameRecord(gameRecordReq);
		return ResponseEntity.ok().body(gameRecordRes);
	}

	@PatchMapping("/{gameRecordUUID}")
	@Operation(summary = "게임 결과 반영", description = "게임 결과를 반영한다.")
	public ResponseEntity<?> updateGameRecord(@PathVariable("gameRecordUUID") UUID gameRecordUUID, @RequestBody GameRecordResultUpdateReq gameRecordResultUpdateReq, HttpServletResponse httpServletResponse) {
		gameRecordService.updateGameRecord(gameRecordUUID, gameRecordResultUpdateReq);
		return ResponseEntity.ok(HttpStatus.OK);
	}

	@PatchMapping("/{gameRecordUUID}/status")
	@Operation(summary = "사용 안하는 게임 결과 상태 수정", description = "게임 상태를 수정한다.")
	public ResponseEntity<?> updateGameRecordStatus(@PathVariable("gameRecordUUID") UUID gameRecordUUID, HttpServletResponse httpServletResponse) {
		gameRecordService.updateGameRecordStatus(gameRecordUUID);
		return ResponseEntity.ok(HttpStatus.OK);
	}

}
