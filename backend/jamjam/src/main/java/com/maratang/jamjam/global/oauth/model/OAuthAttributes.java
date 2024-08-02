package com.maratang.jamjam.global.oauth.model;


import com.maratang.jamjam.domain.member.entity.Member;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OAuthAttributes {

	private String name;
	private String nickname;
	private String providerId;
	private String provider;
	private String email;
	private String profile;

	public Member toMemberEntity() {
		return Member.builder()
			.name(name)
			.nickname(nickname)
			.providerId(providerId)
			.provider(provider)
			.email(email)
			.profile(profile)
			.build();
	}

}
