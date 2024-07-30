package com.maratang.jamjam.domain.attendee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maratang.jamjam.domain.attendee.entity.Attendee;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {

}
