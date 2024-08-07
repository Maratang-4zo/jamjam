package com.maratang.jamjam.domain.room.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.maratang.jamjam.domain.room.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
	Optional<Room> findByRoomUUID(UUID roomUUID);

	@Query("SELECT r FROM Room r JOIN r.attendees a WHERE a.member.memberId = :memberId")
	List<Room> findByMemberId(Long memberId);
}
