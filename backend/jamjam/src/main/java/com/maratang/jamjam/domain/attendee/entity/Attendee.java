package com.maratang.jamjam.domain.attendee.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.memberRoundRecord.entity.MemberRoundRecord;
import com.maratang.jamjam.domain.room.entity.Room;

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
@Table(name = "attendee")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Attendee {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long attendeeId;

	private String nickname;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_id", updatable = false) // DB의 room_id 컬럼과 매핑
	private Room room;

	private LocalDateTime created_at;
	private Double lat;
	private Double lon;
	private String address;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_round_record_id")
	private MemberRoundRecord memberRoundRecord;

	@Column(nullable = false, unique = true, updatable = false)
	private UUID AttendeeUUID;

	@Builder
	public Attendee(Long attendeeId, String nickname, Member member, Room room, LocalDateTime created_at, Double lat,
		Double lon, String address, MemberRoundRecord memberRoundRecord) {
		this.attendeeId = attendeeId;
		this.nickname = nickname;
		this.member = member;
		this.room = room;
		this.created_at = created_at;
		this.lat = lat;
		this.lon = lon;
		this.address = address;
		this.memberRoundRecord = memberRoundRecord;
	}

	@PrePersist
	protected void onCreate() {
		this.AttendeeUUID = UUID.randomUUID();
	}

	public void updateAttendeeLocation(AttendeeUpdateReq attendeeUpdateReq) {
		this.lat = attendeeUpdateReq.getLat();
		this.lon = attendeeUpdateReq.getLon();
		this.address = attendeeUpdateReq.getAddress();
	}
}

