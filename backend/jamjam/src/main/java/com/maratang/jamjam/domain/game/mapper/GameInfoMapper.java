package com.maratang.jamjam.domain.game.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.game.dto.response.GameInfoRes;
import com.maratang.jamjam.domain.game.entity.Game;

@Mapper(componentModel = "spring")
public interface GameInfoMapper {

	GameInfoMapper INSTANCE = Mappers.getMapper(GameInfoMapper.class);

	List<GameInfoRes> gameListToGameInfoListRes(List<Game> gameList);

	GameInfoRes gameToGameInfoRes(Game game);

}
