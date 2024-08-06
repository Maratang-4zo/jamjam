package com.maratang.jamjam.domain.gameRecord.entity;

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
@Table(name = "game_record")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GameRecord {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long gameRecordId;

	@Column(nullable = false, unique = true, updatable = false)
	private UUID gameRecordUUID;

	private Integer roundCnt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ROOM_ID")
	private Room room;

	private String finalStationName;

	@Enumerated(EnumType.STRING)
	private GameRecordStatus gameRecordStatus;

	@Builder
	public GameRecord(Long gameRecordId, UUID gameRecordUUID, Integer roundCnt, Room room, String finalStationName,
		GameRecordStatus gameRecordStatus) {
		this.gameRecordId = gameRecordId;
		this.gameRecordUUID = gameRecordUUID;
		this.roundCnt = roundCnt;
		this.room = room;
		this.finalStationName = finalStationName;
		this.gameRecordStatus = gameRecordStatus;
	}

	@PrePersist
	protected void onCreate() {
		this.gameRecordUUID = UUID.randomUUID();
	}

	public void updateRoom(Room room) {
		this.room = room;
	}
}

