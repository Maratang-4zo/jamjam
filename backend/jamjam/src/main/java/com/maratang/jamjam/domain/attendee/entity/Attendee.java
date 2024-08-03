package com.maratang.jamjam.domain.attendee.entity;

import java.util.UUID;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.memberRoundRecord.entity.MemberRoundRecord;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.global.auditing.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "attendee")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Attendee extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long attendeeId;

	private String nickname;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_id")
	private Room room;

	@Column(nullable = false, unique = true, updatable = false)
	private UUID attendeeUUID;

	@Enumerated(EnumType.STRING)
	private AttendeeStatus attendeeStatus;

	private Double lat;
	private Double lon;
	private String address;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_round_record_id")
	private MemberRoundRecord memberRoundRecord;

	@Builder
	public Attendee(Long attendeeId, String nickname, Member member, Room room, UUID attendeeUUID,
		AttendeeStatus attendeeStatus, Double lat, Double lon, String address, MemberRoundRecord memberRoundRecord) {
		this.attendeeId = attendeeId;
		this.nickname = nickname;
		this.member = member;
		this.room = room;
		this.attendeeUUID = attendeeUUID;
		this.attendeeStatus = attendeeStatus;
		this.lat = lat;
		this.lon = lon;
		this.address = address;
		this.memberRoundRecord = memberRoundRecord;
	}

	@PrePersist
	protected void onCreate() {
		this.attendeeUUID = UUID.randomUUID();
	}

	public void updateAttendeeLocation(AttendeeUpdateReq attendeeUpdateReq) {
		this.lat = attendeeUpdateReq.getLat();
		this.lon = attendeeUpdateReq.getLon();
		this.address = attendeeUpdateReq.getAddress();
	}

	public void updateRoom(Room room) {
		this.room = room;
	}

	public void updateStatus(AttendeeStatus attendeeStatus) {
		this.attendeeStatus = attendeeStatus;
	}
}

