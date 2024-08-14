package com.maratang.jamjam.domain.gamePlay.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.maratang.jamjam.domain.room.entity.Room;

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
@Getter
@Table(name = "game_session")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GameSession {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long gameSessionId;

	private Integer roundCnt;

	private String finalStationName;

	private LocalDateTime endedAt;

	@Column(nullable = false, unique = true, updatable = false)
	private UUID gameSessionUUID;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_id")
	private Room room;

	@Enumerated(EnumType.STRING)
	private GameSessionStatus gameSessionStatus;

	@Builder
	public GameSession(Long gameSessionId, Integer roundCnt, String finalStationName, LocalDateTime endedAt,
		UUID gameSessionUUID, Room room, GameSessionStatus gameSessionStatus) {
		this.gameSessionId = gameSessionId;
		this.roundCnt = roundCnt;
		this.finalStationName = finalStationName;
		this.endedAt = endedAt;
		this.gameSessionUUID = gameSessionUUID;
		this.room = room;
		this.gameSessionStatus = gameSessionStatus;
	}

	@PrePersist
	protected void onCreate() {
		this.gameSessionUUID = UUID.randomUUID();
		this.gameSessionStatus = GameSessionStatus.PLAYING;
	}


	public void updateRoom(Room room) {
		this.room = room;
	}

	public void updateFinalStationName(String finalStationName) {
        this.finalStationName = finalStationName;
    }

	public void updateGameSessionStatus(GameSessionStatus gameSessionStatus) {
		this.gameSessionStatus = gameSessionStatus;
	}
}

