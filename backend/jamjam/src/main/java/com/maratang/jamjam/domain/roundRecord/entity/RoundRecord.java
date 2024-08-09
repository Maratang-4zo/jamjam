package com.maratang.jamjam.domain.roundRecord.entity;

import java.time.LocalDateTime;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.domain.gameRecord.entity.GameRecord;
import com.maratang.jamjam.global.auditing.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "round_record")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoundRecord extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long roundRecordId;

	private Integer round;

	private LocalDateTime endedAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "game_id")
	private Game game;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "game_record_id")
	private GameRecord gameRecord;

	private String stationName;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "attendee_id")
	private Attendee winnderAttendee;

	@Builder
	public RoundRecord(Long roundRecordId, Integer round, LocalDateTime endedAt, Game game, GameRecord gameRecord, String stationName, Attendee winnderAttendee) {
		this.roundRecordId = roundRecordId;
		this.round = round;
		this.endedAt = endedAt;
		this.game = game;
		this.gameRecord = gameRecord;
		this.stationName = stationName;
		this.winnderAttendee = winnderAttendee;
	}

	public void updateStationName(String stationName){
		this.stationName = stationName;
	}

	public void updateGame(Game game){
		this.game = game;
	}

	public void updateGameRecord(GameRecord gameRecord){
		this.gameRecord = gameRecord;
	}
}
