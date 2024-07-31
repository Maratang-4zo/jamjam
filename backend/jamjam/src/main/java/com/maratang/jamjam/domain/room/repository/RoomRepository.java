package com.maratang.jamjam.domain.room.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maratang.jamjam.domain.room.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

	Optional<Room> findByRoomUUID(UUID roomUUID);
}
