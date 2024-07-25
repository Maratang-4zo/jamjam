package com.maratang.jamjam.domain.game.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "game")
public class Game {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	@Column(name = "`order`")
	private Integer order;

	private Boolean is_use;
	private Integer difficulty;
	private String description;
}


