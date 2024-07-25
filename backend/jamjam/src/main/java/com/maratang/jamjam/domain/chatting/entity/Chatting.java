package com.maratang.jamjam.domain.chatting.entity;

import com.maratang.jamjam.domain.attendee.entity.Attendee;

import jakarta.persistence.*;

@Entity
@Table(name = "chatting")
public class Chatting {
	@Id
	private String chatting_id;

	private String content;
	private String created_at;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "attendee_id")
	private Attendee attendee;
}

