package com.maratang.jamjam.domain.game.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "game")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Game {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long gameId;

	private String name;

	@Column(name = "`order`")
	private Integer order;

	private Boolean isUse;
	private Integer difficulty;
	private String description;

	@Builder
	public Game(Long gameId, String name, Integer order, Boolean isUse, Integer difficulty, String description) {
		this.gameId = gameId;
		this.name = name;
		this.order = order;
		this.isUse = isUse;
		this.difficulty = difficulty;
		this.description = description;
	}
}


