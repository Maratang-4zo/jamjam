package com.maratang.jamjam.domain.memberAnalysis.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.maratang.jamjam.domain.memberAnalysis.entity.MemberAnalysis;

public interface MemberAnalysisRepository extends JpaRepository<MemberAnalysis, Long> {

	@Query("select m from MemberAnalysis m where m.member.memberId = :memberId and m.game.gameId = :gameId")
	Optional<MemberAnalysis> findByMemberIdAndGameId(long memberId, long gameId);

	@Query("select m from MemberAnalysis m where m.member.memberId = :memberId")
	Optional<List<MemberAnalysis>> findAllByMemberId(long memberId);
}
