package com.maratang.jamjam.domain.room.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.global.auditing.BaseTimeEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.*;

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

	@Column(name = "`final`")
	private String finalStation;

	private LocalDateTime meetingDate;

	@Enumerated(EnumType.STRING)
	private RoomStatus roomStatus;

	private LocalDateTime endedAt;

	@OneToMany(mappedBy = "room", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Attendee> attendees;

	@Column(nullable = false, unique = true, updatable = false)
	private UUID roomUUID;

	@OneToOne(fetch = FetchType.LAZY)
	private Attendee root;

	@Builder
	public Room(Long roomId, String name, String purpose, String startStation, String finalStation ,LocalDateTime meetingDate,
		RoomStatus roomStatus, LocalDateTime endedAt, List<Attendee> attendees, UUID roomUUID, Attendee root) {
		this.roomId = roomId;
		this.name = name;
		this.purpose = purpose;
		this.startStation = startStation;
		this.finalStation = finalStation;
		this.meetingDate = meetingDate;
		this.roomStatus = roomStatus;
		this.endedAt = endedAt;
		this.attendees = attendees;
		this.roomUUID = roomUUID;
		this.root = root;
	}

	@PrePersist
	protected void onCreate() {
		this.roomUUID = UUID.randomUUID();
		this.attendees = new ArrayList<>();
	}

	public void updateAttendee(Attendee attendee) {
		this.root = attendee;
	}

	public void updateRoom(RoomUpdateReq roomUpdateReq){
		this.meetingDate = roomUpdateReq.getMeetingDay();
		this.name = roomUpdateReq.getName();
		this.purpose = roomUpdateReq.getPurpose();
	}

	public void updateStatus(RoomStatus newStatus) {
		this.roomStatus = newStatus;
	}

	public void updateStation(String station){
		this.startStation = station;
	}

	public void updateStartStation(String startStation){
		this.startStation = startStation;
	}

	public void updateName(String name){
		this.name = name;
	}

	public boolean isRoomClosed(){
		return this.roomStatus == RoomStatus.FINISHED || this.roomStatus == RoomStatus.ABORTED;
	}
}

