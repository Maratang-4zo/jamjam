package com.maratang.jamjam.domain.member.dto.response;

import com.maratang.jamjam.domain.member.entity.Member;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberRes {
	private String nickname;
	private String email;
	private String profile;

	public static MemberRes of(Member member) {
        return MemberRes.builder()
			.nickname(member.getNickname())
			.email(member.getEmail())
			.profile(member.getProfile())
			.build();
    }
}
