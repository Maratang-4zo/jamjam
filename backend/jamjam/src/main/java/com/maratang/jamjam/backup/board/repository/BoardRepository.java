package com.maratang.jamjam.backup.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maratang.jamjam.backup.board.entity.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {

}
