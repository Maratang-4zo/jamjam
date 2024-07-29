package com.maratang.jamjam.global.room;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.room.constant.GrantType;
import com.maratang.jamjam.global.room.constant.TokenType;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenCliams;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenDto;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SuppressWarnings("checkstyle:RegexpMultiline")
@Slf4j
@RequiredArgsConstructor
@Component
public class RoomTokenProvider {

	public static final String AUTHORIZATION_HEADER = "Authorization";

	@Value("${jwt.roomTokenExpiration:60}")
	private String roomTokenExpirationTime;

	// openssl rand -hex 32
	@Value("${jwt.secretKey:anEWd0LXRvaFGFasdQF1432ghSDASGLXNlYd12AesEgeasdfqSDGDGwe3JAEldA==}")
	private String tokenSecret;

	public RoomJwtTokenDto createRoomJwtToken(RoomJwtTokenCliams roomJwtTokenCliams) {

		Date roomTokenExpireTime = createRoomTokenExpireTime();

		String roomToken = createRoomToken(roomJwtTokenCliams, roomTokenExpireTime);

		log.info(roomToken);

		return RoomJwtTokenDto.builder()
			.grantType(GrantType.BEARER.getType())
			.roomToken(roomToken)
			.roomTokenExpireTime(roomTokenExpireTime)
			.build();
	}

	public Date createRoomTokenExpireTime() {
		return new Date(System.currentTimeMillis() + Long.parseLong(roomTokenExpirationTime));
	}


	public String createRoomToken(RoomJwtTokenCliams roomJwtTokenCliams, Date expireTime) {
		String roomToken = Jwts.builder()
			.setSubject(TokenType.ROOM.name())
			.setIssuedAt(new Date())
			.setExpiration(expireTime)
			.claim("roomUUID", roomJwtTokenCliams.getRoomUUID())
			.claim("attendeeUUID", roomJwtTokenCliams.getAttendeeUUID())
			.signWith(SignatureAlgorithm.HS512, tokenSecret.getBytes(StandardCharsets.UTF_8))
			.setHeaderParam("typ", "JWT")
			.compact();
		return roomToken;
	}

	public void validateToken(String token) {
		try {
			Jwts.parser().setSigningKey(tokenSecret.getBytes(StandardCharsets.UTF_8))
				.parseClaimsJws(token);
		} catch (ExpiredJwtException e) {
			log.info("token 만료", e);
			throw new BusinessException(ErrorCode.AU_TOKEN_EXPIRED);
		} catch (Exception e) {
			log.info("유효하지 않은 인증", e);
			throw new BusinessException(ErrorCode.AU_NOT_VALID_TOKEN);
		}
	}

	public Claims getTokenClaims(String token) {
		Claims claims;

		try {
			claims = Jwts.parser().setSigningKey(tokenSecret.getBytes(StandardCharsets.UTF_8))
				.parseClaimsJws(token).getBody();
		} catch (Exception e) {
			log.info("유효하지 않은 토큰", e);
			throw new BusinessException(ErrorCode.AU_NOT_VALID_TOKEN);
		}
		return claims;
	}

}
