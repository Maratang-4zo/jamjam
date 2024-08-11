package com.maratang.jamjam.domain.gamePlay.gameEngine;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameFactory {
	private final Map<UUID, GameEngine> games = new HashMap<>();

	public GameEngine createGame(Long gameId, UUID gameRoundUUID) {
		GameEngine game = null;

		if(gameId == 1){
			game = new RaceGame(gameRoundUUID);
		}

		games.put(gameRoundUUID, game);
		return game;
	}

	public GameEngine getGame(UUID gameRoundUUID) {
		return games.get(gameRoundUUID);
	}

	public void removeGame(UUID gameRoundUUID) {
		games.remove(gameRoundUUID);
	}
}
