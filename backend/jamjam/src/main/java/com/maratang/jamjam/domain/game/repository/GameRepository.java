package com.maratang.jamjam.domain.game.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maratang.jamjam.domain.game.entity.Game;

public interface GameRepository extends JpaRepository<Game, Long> {
}
