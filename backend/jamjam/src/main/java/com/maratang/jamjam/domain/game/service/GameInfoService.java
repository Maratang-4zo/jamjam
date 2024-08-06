package com.maratang.jamjam.domain.game.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.game.dto.response.GameInfoRes;
import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.domain.game.mapper.GameInfoMapper;
import com.maratang.jamjam.domain.game.repository.GameInfoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GameInfoService {

	private final GameInfoRepository gameInfoRepository;

	public List<GameInfoRes> getGameInfoList() {
		List<Game> gameList = gameInfoRepository.findAll();
		return GameInfoMapper.INSTANCE.gameListToGameInfoListRes(gameList);
	}
}
