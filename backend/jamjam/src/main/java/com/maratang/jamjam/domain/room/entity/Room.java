package com.maratang.jamjam.domain.room.entity;

import java.time.LocalDateTime;

import com.maratang.jamjam.domain.attendee.entity.Attendee;

import jakarta.persistence.*;

@Entity
@Table(name = "room")
public class Room {
	@Id
	private Long room_id;

	private String name;
	private String purpose;

	@Column(name = "`start`")
	private LocalDateTime start;

	private LocalDateTime meeting_date;
	private LocalDateTime created_at;
	private LocalDateTime ended_at;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "attendee_id")
	private Attendee attendee;
}

