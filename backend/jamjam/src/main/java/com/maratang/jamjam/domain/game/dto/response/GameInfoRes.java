package com.maratang.jamjam.domain.game.dto.response;

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
}
