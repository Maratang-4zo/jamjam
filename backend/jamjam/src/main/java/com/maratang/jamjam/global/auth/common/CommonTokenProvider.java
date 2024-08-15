package com.maratang.jamjam.global.auth.common;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.maratang.jamjam.global.auth.jwt.constant.TokenType;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;
import com.maratang.jamjam.global.error.exception.BusinessException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CommonTokenProvider {


	public Date createTokenExpireTime(String expirationTime) {
		return new Date(System.currentTimeMillis() + Long.parseLong(expirationTime));
	}

	public String createToken(TokenType tokenType, Map<String, Object> claims, Date expireTime, String tokenSecret) {
		return Jwts.builder()
			.addClaims(claims)
			.setSubject(tokenType.toString())
			.setIssuedAt(new Date())
			.setExpiration(expireTime)
			.signWith(SignatureAlgorithm.HS512, tokenSecret.getBytes(StandardCharsets.UTF_8))
			.setHeaderParam("typ", "JWT")
			.compact();
	}

	public boolean validateToken(String token, TokenType tokenType, String tokenSecret) {
		try {
			Claims claims = Jwts.parser()
				.setSigningKey(tokenSecret.getBytes(StandardCharsets.UTF_8))
				.parseClaimsJws(token).getBody();

			log.info("여기 왜 안나와"+claims.getSubject().toString());
			log.info(claims.toString());

			if(!claims.getSubject().equals(tokenType.name())) {
				throw new AuthenticationException(ErrorCode.NOT_ACCESS_TOKEN);
			}

			return true;
		} catch (ExpiredJwtException e) {
			log.info("{} 만료", tokenType.name(), e);
			return false;
		} catch (Exception e) {
			log.info("유효하지 않은 인증", e);
			throw new AuthenticationException(ErrorCode.NOT_VALID_TOKEN);
		}
	}

	public Claims getTokenClaims(String token, String tokenSecret) {
		try {
			return Jwts.parser().setSigningKey(tokenSecret.getBytes(StandardCharsets.UTF_8))
				.parseClaimsJws(token).getBody();
		} catch (ExpiredJwtException e) {
			log.info("Expired token", e);
			throw new BusinessException(ErrorCode.AU_TOKEN_EXPIRED);
		} catch (Exception e) {
			log.info("Invalid token", e);
			throw new BusinessException(ErrorCode.AU_NOT_VALID_TOKEN);
		}
	}

}
