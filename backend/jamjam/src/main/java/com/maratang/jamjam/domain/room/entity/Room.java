package com.maratang.jamjam.domain.room.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.global.auditing.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
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
	private String startStation;

	private LocalDateTime meetingDate;

	private LocalDateTime endedAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "attendee_id")
	private Attendee attendee;

	@Column(nullable = false, unique = true, updatable = false)
	private UUID roomUUID;

	@Builder
	public Room(Long roomId, String name, String purpose, String startStation, LocalDateTime meetingDate,
		LocalDateTime endedAt, Attendee attendee) {
		this.roomId = roomId;
		this.name = name;
		this.purpose = purpose;
		this.startStation = startStation;
		this.meetingDate = meetingDate;
		this.endedAt = endedAt;
		this.attendee = attendee;
	}

	@PrePersist
	protected void onCreate() {
		this.roomUUID = UUID.randomUUID();
	}

	public void updateAttendee(Attendee attendee) {
		this.attendee = attendee;
	}

	public void updateRoom(RoomUpdateReq roomUpdateReq){
		this.name = roomUpdateReq.getName();
		this.purpose = roomUpdateReq.getPurpose();
	}
}

