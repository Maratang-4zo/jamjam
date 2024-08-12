package com.maratang.jamjam.global.auth.jwt.manager;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.service.MemberService;
import com.maratang.jamjam.global.auth.jwt.constant.GrantType;
import com.maratang.jamjam.global.auth.jwt.constant.TokenType;
import com.maratang.jamjam.global.auth.jwt.dto.JwtTokenDto;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class TokenManager {

	@Value("${token.access-token-expiration-time}")
	private String accessTokenExpirationTime;

	@Value("${token.refresh-token-expiration-time}")
	private String refreshTokenExpirationTime;

	@Value("${token.secret}")
	private String tokenSecret;

	private final MemberService memberService;


	public JwtTokenDto createJwtToken(String email, String nickname) {
		Date accessTokenExpireTime = createAccessTokenExpireTime();
		Date refreshTokenExpireTime = createRefreshTokenExpireTime();

		String accessToken = createAccessToken(email, nickname, accessTokenExpireTime);
		String refreshToken = createRefreshToken(email, nickname, refreshTokenExpireTime);

		log.info(accessToken);
		log.info(refreshToken);

		return JwtTokenDto.builder()
			.grantType(GrantType.BEARER.getType())
			.accessToken(accessToken)
			.accessTokenExpireTime(accessTokenExpireTime)
			.refreshToken(refreshToken)
			.refreshTokenExpireTime(refreshTokenExpireTime)
			.build();
	}

	public Date createAccessTokenExpireTime() {
		return new Date(System.currentTimeMillis() + Long.parseLong(accessTokenExpirationTime));
	}

	public Date createRefreshTokenExpireTime() {
		return new Date(System.currentTimeMillis() + Long.parseLong(refreshTokenExpirationTime));
	}

	public String createAccessToken(String email, String nickname, Date expireTime) {
		String accessToken = Jwts.builder()
			.setSubject(TokenType.ACCESS.name())
			.setIssuedAt(new Date())
			.setExpiration(expireTime)
			.claim("email", email)
			.claim("nickname", nickname)
			.signWith(SignatureAlgorithm.HS512, tokenSecret.getBytes(StandardCharsets.UTF_8))
			.setHeaderParam("typ", "JWT")
			.compact();
		return accessToken;
	}

	public String createRefreshToken(String email, String nickname, Date expireTime) {
		String refreshToken = Jwts.builder()
			.setSubject(TokenType.REFRESH.name())
			.setIssuedAt(new Date())
			.setExpiration(expireTime)
			.claim("email", email)
			.claim("nickname", nickname)
			.signWith(SignatureAlgorithm.HS512, tokenSecret.getBytes(StandardCharsets.UTF_8))
			.setHeaderParam("typ", "JWT")
			.compact();
		return refreshToken;
	}

	public boolean validateAccessToken(String token, HttpServletRequest request, HttpServletResponse response) {
		try {
			Jwts.parser().setSigningKey(tokenSecret.getBytes(StandardCharsets.UTF_8))
				.parseClaimsJws(token);
			return true;
		} catch (ExpiredJwtException e) {
			log.info("accessToken 만료", e);
			return false;
		} catch (Exception e) {
			log.info("유효하지 않은 인증", e);
			expiredCookies(request, response);
			throw new AuthenticationException(ErrorCode.NOT_VALID_TOKEN);
		}
	}

	public boolean validateRefreshToken(String token, HttpServletRequest request, HttpServletResponse response) {
		try {
			Jwts.parser().setSigningKey(tokenSecret.getBytes(StandardCharsets.UTF_8))
				.parseClaimsJws(token);
			return true;
		} catch (ExpiredJwtException e) {
			log.info("refreshToken 만료", e);
			expiredCookies(request, response);
			throw new AuthenticationException(ErrorCode.REFRESH_TOKEN_EXPIRED);
		} catch (Exception e) {
			log.info("유효하지 않은 인증", e);
			expiredCookies(request, response);
			throw new AuthenticationException(ErrorCode.NOT_VALID_TOKEN);
		}
	}

	public String reissueToken(String refreshToken) {
		Member member = memberService.findMemberByRefreshToken(refreshToken);
		log.info("재발급이다 이놈아");
		String newToken = createAccessToken(member.getEmail(), member.getNickname(), createAccessTokenExpireTime());
		return newToken;
	}


	public Claims getTokenClaims(String token) {
		Claims claims;

		try {
			claims = Jwts.parser().setSigningKey(tokenSecret.getBytes(StandardCharsets.UTF_8))
				.parseClaimsJws(token).getBody();
		} catch (Exception e) {
			log.info("유효하지 않은 토큰", e);
			throw new AuthenticationException(ErrorCode.NOT_VALID_TOKEN);
		}
		return claims;
	}

	private void expiredCookies(HttpServletRequest request, HttpServletResponse response) {
		Cookie[] cookies = request.getCookies();
		for (int i = 0; i < cookies.length; i++) {
			if (cookies[i].getName().equals("refreshToken")) {
				cookies[i].setMaxAge(0);
				cookies[i].setValue(null);
				cookies[i].setPath("/");
				cookies[i].setHttpOnly(true);
				cookies[i].setSecure(true);
				response.addCookie(cookies[i]);
			}
			if (cookies[i].getName().equals("accessToken")) {
				cookies[i].setMaxAge(0);
				cookies[i].setValue(null);
				cookies[i].setPath("/");
				response.addCookie(cookies[i]);
			}
		}
		log.info("쿠키 만료 완");
	}

}
