package com.maratang.jamjam.domain.login.logout.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.service.MemberService;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;
import com.maratang.jamjam.global.jwt.constant.TokenType;
import com.maratang.jamjam.global.jwt.service.TokenManager;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LogoutService {

	private final MemberService memberService;
	private final TokenManager tokenManager;

	public void logout(String accessToken) {

		// 1. 토큰 검증
		Claims tokenClaims = tokenManager.getTokenClaims(accessToken);
		String tokenType = tokenClaims.getSubject();
		if (!TokenType.isAccess(tokenType)) {
			throw new AuthenticationException(ErrorCode.NOT_ACCESS_TOKEN);
		}

		// 2. 토큰 타입 확인
		String memberEmail = String.valueOf(tokenClaims.get("email"));
		Member member = memberService.findMemberByEmail(memberEmail);
		member.expireRefreshToken(LocalDateTime.now());
	}
}
