package com.maratang.jamjam.domain.board.controller;

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

import com.maratang.jamjam.domain.board.dto.request.BoardCreateReq;
import com.maratang.jamjam.domain.board.dto.request.BoardUpdateReq;
import com.maratang.jamjam.domain.board.dto.response.BoardRes;
import com.maratang.jamjam.domain.board.service.BoardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
	private final BoardService boardService;

	@GetMapping
	public ResponseEntity<?> getBoardList() {
		List<BoardRes> boardList = boardService.getBoardList();
		return ResponseEntity.status(HttpStatus.OK).body(boardList); // int or HttpStatus
	}

	@GetMapping("/{boardId}")
	public ResponseEntity<?> getBoard(@PathVariable Long boardId) {
		BoardRes board = boardService.getBoard(boardId);
		return ResponseEntity.status(HttpStatus.OK).body(board);
	}

	@PostMapping
	public ResponseEntity<?> createBoard(@RequestBody BoardCreateReq boardCreateReq) {
		boardService.createBoard(boardCreateReq);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@PatchMapping("/{boardId}")
	public ResponseEntity<?> updateBoard(@PathVariable Long boardId, @RequestBody BoardUpdateReq boardUpdateReq) {
		boardService.updateBoard(boardId, boardUpdateReq);
		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@DeleteMapping("/{boardId}")
	public ResponseEntity<?> deleteBoard(@PathVariable Long boardId) {
		boardService.deleteBoard(boardId);
		return ResponseEntity.status(HttpStatus.OK).build();
	}

}
