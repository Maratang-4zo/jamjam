package com.maratang.jamjam.backup.board.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.backup.board.dto.request.BoardCreateReq;
import com.maratang.jamjam.backup.board.dto.request.BoardUpdateReq;
import com.maratang.jamjam.backup.board.dto.response.BoardRes;
import com.maratang.jamjam.backup.board.service.BoardService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {
	private final BoardService boardService;

	@GetMapping
	@Operation(summary = "🚌 기본 템플릿")
	public ResponseEntity<?> getBoardList() {
		List<BoardRes> boardList = boardService.getBoardList();
		return ResponseEntity.status(HttpStatus.OK).body(boardList); // int or HttpStatus
	}

	@GetMapping("/{boardId}")
	@Operation(summary = "🚌 기본 템플릿")
	public ResponseEntity<?> getBoard(@PathVariable Long boardId) {
		BoardRes board = boardService.getBoard(boardId);
		return ResponseEntity.status(HttpStatus.OK).body(board);
	}

	@PostMapping
	@Operation(summary = "🚌 기본 템플릿")
	public ResponseEntity<?> createBoard(@RequestBody BoardCreateReq boardCreateReq) {
		boardService.createBoard(boardCreateReq);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@PatchMapping("/{boardId}")
	@Operation(summary = "🚌 기본 템플릿")
	public ResponseEntity<?> updateBoard(@PathVariable Long boardId, @RequestBody BoardUpdateReq boardUpdateReq) {
		boardService.updateBoard(boardId, boardUpdateReq);
		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@DeleteMapping("/{boardId}")
	@Operation(summary = "🚌 기본 템플릿")
	public ResponseEntity<?> deleteBoard(@PathVariable Long boardId) {
		boardService.deleteBoard(boardId);
		return ResponseEntity.status(HttpStatus.OK).build();
	}
}
