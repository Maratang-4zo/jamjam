package com.maratang.jamjam.domain.gameRecord.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.maratang.jamjam.domain.gameRecord.entity.GameRecord;

public interface GameRecordRepository extends JpaRepository<GameRecord, Long> {

	@Query("SELECT g FROM GameRecord g WHERE g.gameRecordUUID = :gameRecordUUID")
	Optional<GameRecord> findByUUID(UUID gameRecordUUID);
}
