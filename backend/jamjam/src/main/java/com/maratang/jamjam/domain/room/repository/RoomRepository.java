package com.maratang.jamjam.domain.room.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maratang.jamjam.domain.room.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
