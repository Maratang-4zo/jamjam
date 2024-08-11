package com.maratang.jamjam.domain.member.entity;

import java.time.LocalDateTime;

import com.maratang.jamjam.global.auditing.BaseTimeEntity;
import com.maratang.jamjam.global.auth.jwt.dto.JwtTokenDto;
import com.maratang.jamjam.global.util.DateTimeUtils;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long memberId;
	@Column(nullable = false, length = 20)
	private String name;
	@Column(nullable = false, length = 20)
	private String nickname;
	private String providerId;
	@Column(nullable = false)
	private String provider;
	@Column(unique = true, length = 50, nullable = false)
	private String email;
	@Column(length = 1024)
	private String profile;
	@Column(length = 512)
	private String refreshToken;

	private LocalDateTime tokenExpirationTime;

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

	public void updateRefreshToken(JwtTokenDto jwtTokenDto) {
		this.refreshToken = jwtTokenDto.getRefreshToken();
		this.tokenExpirationTime = DateTimeUtils.convertToLocalDateTime(jwtTokenDto.getRefreshTokenExpireTime());
	}

	public void expireRefreshToken(LocalDateTime now) {
		this.tokenExpirationTime = now;
	}

	public void updateNickname(String nickname){
		this.nickname = nickname;
	}
}

