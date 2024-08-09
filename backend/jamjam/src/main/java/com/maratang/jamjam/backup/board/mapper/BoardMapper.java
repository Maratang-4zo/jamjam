package com.maratang.jamjam.backup.board.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.backup.board.dto.request.BoardCreateReq;
import com.maratang.jamjam.backup.board.entity.Board;
import com.maratang.jamjam.backup.board.dto.response.BoardRes;

@Mapper
public interface BoardMapper {

	BoardMapper INSTANCE = Mappers.getMapper(BoardMapper.class);

	List<BoardRes> boardListToBoardListRes(List<Board> board);

	BoardRes boardToBoardRes(Board board);

	Board boardCreateReqToBoard(BoardCreateReq boardCreateReq);

}
