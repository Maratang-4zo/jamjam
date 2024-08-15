package com.maratang.jamjam.global.auth.jwt.manager;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.service.MemberService;
import com.maratang.jamjam.global.auth.common.CommonTokenProvider;
import com.maratang.jamjam.global.auth.jwt.constant.TokenType;
import com.maratang.jamjam.global.auth.jwt.dto.JwtTokenDto;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;
import com.maratang.jamjam.global.util.CookieUtils;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class LoginTokenManager {

	@Value("${token.access-token-expiration-time}")
	private String accessTokenExpirationTime;

	@Value("${token.refresh-token-expiration-time}")
	private String refreshTokenExpirationTime;

	@Value("${token.secret}")
	private String tokenSecret;

	private final MemberService memberService;

	private final CommonTokenProvider tokenProvider;

	private static final String ACCESS_TOKEN_COOKIE = "accessToken";

	public JwtTokenDto createJwtToken(String email, String nickname) {
		Date accessTokenExpireTime = tokenProvider.createTokenExpireTime(accessTokenExpirationTime);
		Date refreshTokenExpireTime = tokenProvider.createTokenExpireTime(refreshTokenExpirationTime);

		Map<String, Object> claims = new HashMap<>();
		claims.put("email", email);
		claims.put("nickname", nickname);

		String accessToken = tokenProvider.createToken(TokenType.ACCESS, claims, accessTokenExpireTime, tokenSecret);
		String refreshToken = tokenProvider.createToken(TokenType.REFRESH, claims, refreshTokenExpireTime, tokenSecret);

		log.info(accessToken);
		log.info(refreshToken);

		return JwtTokenDto.of(accessToken, accessTokenExpireTime, refreshToken, refreshTokenExpireTime);
	}

	public String reissueToken(String refreshToken) {
		Member member = memberService.findMemberByRefreshToken(refreshToken);
		log.info("재발급이다 이놈아");

		Map<String, Object> claims = new HashMap<>();
		claims.put("email", member.getEmail());
		claims.put("nickname", member.getNickname());

		return tokenProvider.createToken(TokenType.ACCESS, claims, tokenProvider.createTokenExpireTime(accessTokenExpirationTime), tokenSecret);
	}

	public String validateAndRefreshTokenIfNeeded(String accessToken, String refreshToken, HttpServletRequest request,HttpServletResponse response) {
		if (!tokenProvider.validateToken(accessToken, TokenType.ACCESS, tokenSecret)) {
			if (tokenProvider.validateToken(refreshToken, TokenType.REFRESH, tokenSecret)) {
				String newAccessToken = reissueToken(refreshToken);
				CookieUtils.createSessionCookie(response, ACCESS_TOKEN_COOKIE, newAccessToken);
				return newAccessToken;
			} else {
				CookieUtils.removeCookie(request, response, "accessToken");
				CookieUtils.removeCookie(request, response, "refreshToken");
				throw new AuthenticationException(ErrorCode.NOT_VALID_TOKEN);
			}
		}
		return accessToken;
	}

	public String getMemberEmail(String accessToken){
		Claims claims = tokenProvider.getTokenClaims(accessToken, tokenSecret);
        return (String) claims.get("email");
	}

	public Claims getTokenClaims(String accessToken){
		return tokenProvider.getTokenClaims(accessToken, tokenSecret);
	}

}
