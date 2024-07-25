package com.maratang.jamjam.domain.member.entity;

import com.maratang.jamjam.global.auditing.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long memberId;

	private String name;
	private String nickname;
	private String providerId;
	private String provider;
	private String email;
	private String profile;

	@Builder
	public Member(Long memberId, String name, String nickname, String providerId, String provider, String email,
		String profile) {
		this.memberId = memberId;
		this.name = name;
		this.nickname = nickname;
		this.providerId = providerId;
		this.provider = provider;
		this.email = email;
		this.profile = profile;
	}
}

