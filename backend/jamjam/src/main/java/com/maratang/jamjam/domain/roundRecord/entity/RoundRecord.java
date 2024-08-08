package com.maratang.jamjam.domain.roundRecord.entity;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.domain.gameRecord.entity.GameRecord;
import com.maratang.jamjam.global.auditing.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
	private Attendee attendee;

	@Builder
	public RoundRecord(Long roundRecordId, Integer round, LocalDateTime endedAt, Game game, GameRecord gameRecord, String stationName, Attendee attendee) {
		this.roundRecordId = roundRecordId;
		this.round = round;
		this.endedAt = endedAt;
		this.game = game;
		this.gameRecord = gameRecord;
		this.stationName = stationName;
		this.attendee = attendee;
	}

	public void updateStationName(String stationName){
		this.stationName = stationName;
	}
}
