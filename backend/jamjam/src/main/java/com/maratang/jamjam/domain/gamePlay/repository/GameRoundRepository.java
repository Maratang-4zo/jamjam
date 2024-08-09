package com.maratang.jamjam.domain.gamePlay.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.maratang.jamjam.domain.gamePlay.entity.GameRound;

public interface GameRoundRepository extends JpaRepository<GameRound, Long> {

	@Query("""
		select r
		from GameRound r
		where r.gameSession.gameSessionId = :gameSessionId
		""")
	List<GameRound> findAllByGameSessionId(Long gameSessionId);

	Optional<GameRound> findByGameRoundUUID(UUID gameRoundUUID);
}
