package com.maratang.jamjam.domain.memberRoundRecord.entity;

import com.maratang.jamjam.domain.roundRecord.entity.RoundRecord;

import jakarta.persistence.*;

@Entity
@Table(name = "member_round_record")
public class MemberRoundRecord {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long member_round_record_id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "round_record_id")
	private RoundRecord roundRecord;

	private Boolean isPlay;
}

