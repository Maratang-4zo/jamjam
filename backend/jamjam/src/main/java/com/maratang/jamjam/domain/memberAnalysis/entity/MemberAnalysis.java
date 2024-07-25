package com.maratang.jamjam.domain.memberAnalysis.entity;

import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.domain.member.entity.Member;

import jakarta.persistence.*;

@Entity
@Table(name = "member_analysis")
public class MemberAnalysis {
	@Id
	private Long id;

	private String rate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id2")
	private Game game;
}

