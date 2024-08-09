package com.maratang.jamjam.domain.randomName.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.maratang.jamjam.domain.randomName.entity.Name;

public interface NameRepository extends JpaRepository<Name, Long> {
	@Query(value = "SELECT * FROM name ORDER BY RAND() LIMIT 1", nativeQuery = true)
	Name findRandomName();
}
