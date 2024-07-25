package com.maratang.jamjam.domain.attendee.entity;

import java.time.LocalDateTime;

import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.memberRoundRecord.entity.MemberRoundRecord;
import com.maratang.jamjam.domain.room.entity.Room;

import jakarta.persistence.*;

@Entity
@Table(name = "attendee")
public class Attendee {
	@Id
	private Long attendee_id;

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
}

