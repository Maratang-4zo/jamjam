package com.maratang.jamjam.domain.member.dto.request;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberReq {

	private String email;
	private String nickname;

}
