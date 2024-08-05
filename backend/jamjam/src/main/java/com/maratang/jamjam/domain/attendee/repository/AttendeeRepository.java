package com.maratang.jamjam.domain.attendee.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.room.entity.Room;
import org.springframework.data.jpa.repository.Query;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
	Optional<Attendee> findByAttendeeUUIDAndRoom(UUID attendeeId, Room room);
	Optional<Attendee> findByAttendeeUUID(UUID attendeeUUID);

	List<Attendee> findByRoom_RoomUUID(UUID roomUUID);

	@Query("""
        select a
        from Attendee a
        where a.room.roomId = :roomId
        """)
    List<Attendee> findAllByRoomId(Long roomId);
}
