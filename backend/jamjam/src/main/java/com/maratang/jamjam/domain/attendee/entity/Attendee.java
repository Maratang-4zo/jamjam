package com.maratang.jamjam.domain.attendee.entity;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.gamePlay.entity.MemberRoundRecord;
import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.global.auditing.BaseTimeEntity;
import com.maratang.jamjam.global.auth.room.constant.ProfileType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Random;
import java.util.UUID;

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

	@Column(name = "attendee_status")
	@Enumerated(EnumType.STRING)
	private AttendeeStatus attendeeStatus;

	private Double lat;
	private Double lon;
	private String address;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_round_record_id")
	private MemberRoundRecord memberRoundRecord;

	private Long duration; // 소요시간 (단위: 초)
	private String route; // 경로

	@Enumerated(EnumType.STRING)
	private ProfileType profileImageUrl;

	@Builder
	public Attendee(Long attendeeId, String nickname, Member member, Room room, UUID attendeeUUID,
		AttendeeStatus attendeeStatus, Double lat, Double lon, String address,
		MemberRoundRecord memberRoundRecord, Long duration, String route, ProfileType profileImageUrl) {
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
		this.duration = duration;
		this.route = route;
		this.profileImageUrl = profileImageUrl;
	}

	@PrePersist
	protected void onCreate() {
		this.attendeeUUID = UUID.randomUUID();
		this.profileImageUrl = ProfileType.values()[new Random().nextInt(ProfileType.values().length)];
		this.attendeeStatus = AttendeeStatus.CREATED;
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

	public void updateDuration(Long duration) {
		this.duration = duration;
	}

	public void updateRoute(String route) {
		this.route = route;
	}

	public void updateMember(Member member) {
		this.member = member;
	}

	public void updateProfileImageUrl(ProfileType profileImageUrl) {
		this.profileImageUrl = profileImageUrl;
	}
}
