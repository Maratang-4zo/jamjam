package com.maratang.jamjam.domain.attendee.entity;

import java.time.LocalDateTime;

import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.memberRoundRecord.entity.MemberRoundRecord;
import com.maratang.jamjam.domain.room.entity.Room;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
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
	@JoinColumn(name = "room_id")
	private Room room;

	private LocalDateTime created_at;
	private Double lat;
	private Double lon;
	private String address;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_round_record_id")
	private MemberRoundRecord memberRoundRecord;

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
}

