package com.maratang.jamjam.domain.randomName.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.maratang.jamjam.domain.randomName.entity.Nick;

public interface NickRepository extends JpaRepository<Nick, Long> {
	@Query(value = "SELECT * FROM inck ORDER BY RAND() LIMIT 1", nativeQuery = true)
	Nick findRandomNick();
}
