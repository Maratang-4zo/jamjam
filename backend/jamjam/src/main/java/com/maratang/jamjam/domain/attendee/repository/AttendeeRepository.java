package com.maratang.jamjam.domain.attendee.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.room.entity.Room;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
	Optional<Attendee> findByAttendeeUUIDAndRoom(UUID attendeeId, Room room);
	Optional<Attendee> findByAttendeeUUID(UUID attendeeUUID);

	List<Attendee> findByRoom_RoomUUID(UUID roomUuid);
}
