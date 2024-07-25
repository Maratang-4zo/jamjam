package com.maratang.jamjam.domain.gameRecord.entity;

import com.maratang.jamjam.domain.room.entity.Room;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "game_record")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GameRecord {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long gameRecordId;

	private Integer roundCnt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_id")
	private Room room;

	private String finalStationName;

	@Builder
	public GameRecord(Long gameRecordId, Integer roundCnt, Room room, String finalStationName) {
		this.gameRecordId = gameRecordId;
		this.roundCnt = roundCnt;
		this.room = room;
		this.finalStationName = finalStationName;
	}
}

