package com.maratang.jamjam.domain.board.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.board.dto.request.BoardCreateReq;
import com.maratang.jamjam.domain.board.dto.request.BoardUpdateReq;
import com.maratang.jamjam.domain.board.dto.response.BoardRes;
import com.maratang.jamjam.domain.board.entity.Board;
import com.maratang.jamjam.domain.board.mapper.BoardMapper;
import com.maratang.jamjam.domain.board.repository.BoardRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {
	private final BoardRepository boardRepository;

	public List<BoardRes> getBoardList() {
		List<Board> boardList = boardRepository.findAll();
		return BoardMapper.INSTANCE.boardListToBoardListRes(boardList);
	}

	public BoardRes getBoard(Long boardId) {
		Board board = boardRepository.findById(boardId).orElseThrow(() -> new BusinessException(ErrorCode.BAD_REQUEST));
		return BoardMapper.INSTANCE.boardToBoardRes(board);
	}

	@Transactional
	public void createBoard(BoardCreateReq boardCreateReq) {
		Board board = BoardMapper.INSTANCE.boardCreateReqToBoard(boardCreateReq);
		boardRepository.save(board);
	}

	@Transactional
	public void updateBoard(Long boardId, BoardUpdateReq boardUpdateReq) {
		Board board = boardRepository.findById(boardId).orElseThrow(() -> new BusinessException(ErrorCode.BAD_REQUEST));
		//
	}

	@Transactional
	public void deleteBoard(Long boardId) {
		boardRepository.deleteById(boardId);
	}
}
