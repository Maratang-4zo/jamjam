package com.maratang.jamjam.domain.board.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.board.dto.request.BoardCreateReq;
import com.maratang.jamjam.domain.board.dto.response.BoardRes;
import com.maratang.jamjam.domain.board.entity.Board;

@Mapper
public interface BoardMapper {

	BoardMapper INSTANCE = Mappers.getMapper(BoardMapper.class);

	List<BoardRes> boardListToBoardListRes(List<Board> board);

	BoardRes boardToBoardRes(Board board);

	Board boardCreateReqToBoard(BoardCreateReq boardCreateReq);

}
