package com.maratang.jamjam.domain.gamePlay.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maratang.jamjam.domain.gamePlay.entity.GameSession;

public interface GameSessionRepository extends JpaRepository<GameSession, Long> {

	Optional<GameSession> findByGameSessionUUID(UUID gameSessionUUID);

}
