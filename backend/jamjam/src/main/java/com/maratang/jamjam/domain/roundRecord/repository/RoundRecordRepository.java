package com.maratang.jamjam.domain.roundRecord.repository;

import com.maratang.jamjam.domain.roundRecord.entity.RoundRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoundRecordRepository extends JpaRepository<RoundRecord, Long> {
}
