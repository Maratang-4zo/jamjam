package com.maratang.jamjam.domain.roundRecord.entity;

import java.time.LocalDateTime;

import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.domain.gameRecord.entity.GameRecord;

import jakarta.persistence.*;

@Entity
@Table(name = "round_record")
public class RoundRecord {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long round_record_id;

	private Integer round;
	private LocalDateTime created_at;
	private LocalDateTime ended_at;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "game_id")
	private Game game;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "game_record_id")
	private GameRecord gameRecord;

	private String station_name;
}

