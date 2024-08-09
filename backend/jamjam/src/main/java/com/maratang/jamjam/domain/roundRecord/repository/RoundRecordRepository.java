package com.maratang.jamjam.domain.roundRecord.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.maratang.jamjam.domain.roundRecord.entity.RoundRecord;

public interface RoundRecordRepository extends JpaRepository<RoundRecord, Long> {

	@Query("""
		select r
		from RoundRecord r
		where r.gameRecord.gameRecordId = :gameRecordId
		""")
	List<RoundRecord> findAllByGameRecordId(Long gameRecordId);
}
