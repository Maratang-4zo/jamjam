package com.maratang.jamjam.domain.attendee.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maratang.jamjam.domain.attendee.entity.Attendee;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {

	Optional<Attendee> findByAttendeeUUID(UUID attendeeUUID);
}
