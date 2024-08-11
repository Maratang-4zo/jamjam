package com.maratang.jamjam.domain.gamePlay.entity;

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
@Table(name = "member_round_record")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberRoundRecord {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long memberRoundRecordId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "game_round_id")
	private GameRound gameRound;

	private Boolean isPlay;

	@Builder
	public MemberRoundRecord(Long memberRoundRecordId, GameRound gameRound, Boolean isPlay) {
		this.memberRoundRecordId = memberRoundRecordId;
		this.gameRound = gameRound;
		this.isPlay = isPlay;
	}
}

