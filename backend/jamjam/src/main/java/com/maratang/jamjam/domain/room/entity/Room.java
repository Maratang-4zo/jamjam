package com.maratang.jamjam.domain.room.entity;

import java.time.LocalDateTime;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.global.auditing.BaseTimeEntity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "room")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Room extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long roomId;

	private String name;
	private String purpose;

	@Column(name = "`start`")
	private LocalDateTime start;

	private LocalDateTime meetingDate;

	private LocalDateTime endedAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "attendee_id")
	private Attendee attendee;

	@Builder
	public Room(Long roomId, String name, String purpose, LocalDateTime start, LocalDateTime meetingDate,
		LocalDateTime endedAt, Attendee attendee) {
		this.roomId = roomId;
		this.name = name;
		this.purpose = purpose;
		this.start = start;
		this.meetingDate = meetingDate;
		this.endedAt = endedAt;
		this.attendee = attendee;
	}
}

