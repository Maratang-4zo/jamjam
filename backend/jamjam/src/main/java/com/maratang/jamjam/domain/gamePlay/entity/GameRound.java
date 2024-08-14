package com.maratang.jamjam.domain.gamePlay.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.global.auditing.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "game_round")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GameRound extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long gameRoundId;

	private Integer round;

	private String stationName;

	@Column(nullable = false, unique = true, updatable = false)
	private UUID gameRoundUUID;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "game_id")
	private Game game;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "game_session_id")
	private GameSession gameSession;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "attendee_id")
	private Attendee winnderAttendee;

	private LocalDateTime endedAt;

	@Enumerated(EnumType.STRING)
	private GameRoundStatus gameRoundStatus;

	@Builder
	public GameRound(Long gameRoundId, Integer round, String stationName, Game game, GameSession gameSession,
		Attendee winnderAttendee, LocalDateTime endedAt, GameRoundStatus gameRoundStatus) {
		this.gameRoundId = gameRoundId;
		this.round = round;
		this.stationName = stationName;
		this.game = game;
		this.gameSession = gameSession;
		this.winnderAttendee = winnderAttendee;
		this.endedAt = endedAt;
		this.gameRoundStatus = gameRoundStatus;
	}

	@PrePersist
	protected void onCreate() {
		this.gameRoundUUID = UUID.randomUUID();
		this.gameRoundStatus = GameRoundStatus.PLAYING;
	}

	public void updateStationName(String stationName){
		this.stationName = stationName;
	}

	public void updateWinner(Attendee attendee){
		this.winnderAttendee = attendee;
		this.gameRoundStatus = GameRoundStatus.SUCCESS;
		this.endedAt = LocalDateTime.now();
	}
}
