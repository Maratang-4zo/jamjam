package com.maratang.jamjam.domain.member.dto.response;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberRes {
	private String nickname;
	private String email;
	private String profile;

}
