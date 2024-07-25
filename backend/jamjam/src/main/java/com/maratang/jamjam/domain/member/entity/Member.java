package com.maratang.jamjam.domain.member.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "member")
public class Member {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long member_id;

	private String name;
	private String nickname;
	private String provider_id;
	private String provider;
	private String email;
	private LocalDateTime created_at;
	private String profile;
}

