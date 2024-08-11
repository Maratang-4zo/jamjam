package com.maratang.jamjam.domain.game.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.game.dto.response.GameInfoRes;
import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.domain.game.repository.GameRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GameService {

	private final GameRepository gameRepository;

	public List<GameInfoRes> getGameInfoList() {
		List<Game> gameList = gameRepository.findAll();
		return GameInfoRes.of(gameList);
	}

}
