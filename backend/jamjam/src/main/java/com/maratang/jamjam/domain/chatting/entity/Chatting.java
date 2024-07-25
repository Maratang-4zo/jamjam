package com.maratang.jamjam.domain.chatting.entity;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.global.auditing.BaseTimeEntity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chatting")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chatting extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private String chattingId;

	private String content;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "attendee_id")
	private Attendee attendee;

	@Builder
	public Chatting(String chattingId, String content, Attendee attendee) {
		this.chattingId = chattingId;
		this.content = content;
		this.attendee = attendee;
	}
}

