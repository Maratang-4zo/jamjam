package com.maratang.jamjam.domain.memberRoundRecord.entity;

import com.maratang.jamjam.domain.roundRecord.entity.RoundRecord;

import jakarta.persistence.*;
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
	@JoinColumn(name = "round_record_id")
	private RoundRecord roundRecord;

	private Boolean isPlay;

	@Builder
	public MemberRoundRecord(Long memberRoundRecordId, RoundRecord roundRecord, Boolean isPlay) {
		this.memberRoundRecordId = memberRoundRecordId;
		this.roundRecord = roundRecord;
		this.isPlay = isPlay;
	}
}

