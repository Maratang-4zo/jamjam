package com.maratang.jamjam.domain.login.logout.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.service.MemberService;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;
import com.maratang.jamjam.global.auth.jwt.constant.TokenType;
import com.maratang.jamjam.global.auth.jwt.manager.LoginTokenManager;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LogoutService {

	private final MemberService memberService;
	private final LoginTokenManager loginTokenManager;

	public void logout(String accessToken) {

		// 1. 토큰 검증
		Claims tokenClaims = loginTokenManager.getTokenClaims(accessToken);
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
