package com.maratang.jamjam.domain.game.dto.response;

import java.util.List;

import com.maratang.jamjam.domain.game.entity.Game;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameInfoRes {
	private String name;
	private Integer order;
	private Boolean isUse;
	private Integer difficulty;
	private String description;

	public static GameInfoRes of(Game game) {
		return GameInfoRes.builder()
			.name(game.getName())
            .order(game.getOrder())
            .isUse(game.getIsUse())
            .difficulty(game.getDifficulty())
            .description(game.getDescription())
            .build();
	}

	public static List<GameInfoRes> of(List<Game> games) {
		return games.stream().map(GameInfoRes::of).toList();
	}
}
