package com.maratang.jamjam.domain.memberAnalysis.entity;

import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.domain.member.entity.Member;

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
@Table(name = "member_analysis")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberAnalysis {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long memberAnalysisId;

	private String rate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "game_id")
	private Game game;

	@Builder
	public MemberAnalysis(Long memberAnalysisId, String rate, Member member, Game game) {
		this.memberAnalysisId = memberAnalysisId;
		this.rate = rate;
		this.member = member;
		this.game = game;
	}
}

