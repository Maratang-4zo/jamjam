package com.maratang.jamjam.global.auth.room;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import com.maratang.jamjam.global.auth.room.constant.GrantType;
import com.maratang.jamjam.global.auth.room.constant.TokenType;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenDto;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenClaims;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SuppressWarnings("checkstyle:RegexpMultiline")
@Slf4j
@RequiredArgsConstructor
@Component
public class RoomTokenProvider {

	public static final String tokenName = "roomToken";

	@Value("${jwt.roomTokenExpiration:60000000000000}")
	private String roomTokenExpirationTime;

	// openssl rand -hex 32
	@Value("${jwt.secretKey:anEWd0LXRvaFGFasdQF1432ghSDASGLXNlYd12AesEgeasdfqSDGDGwe3JAEldA==}")
	private String tokenSecret;

	public String resolveToken(HttpServletRequest request){
		Cookie cookie = WebUtils.getCookie(request, tokenName);
		if(cookie != null){
			return cookie.getValue();
		}
		return null;
	}

	public RoomJwtTokenDto createRoomJwtToken(RoomJwtTokenClaims roomJwtTokenClaims) {

		Date roomTokenExpireTime = createRoomTokenExpireTime();

		String roomToken = createRoomToken(roomJwtTokenClaims, roomTokenExpireTime);

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


	public String createRoomToken(RoomJwtTokenClaims roomJwtTokenClaims, Date expireTime) {
		return Jwts.builder()
			.setSubject(TokenType.ROOM.name())
			.setIssuedAt(new Date())
			.setExpiration(expireTime)
			.claim("roomUUID", roomJwtTokenClaims.getRoomUUID())
			.claim("attendeeUUID", roomJwtTokenClaims.getAttendeeUUID())
			.signWith(SignatureAlgorithm.HS512, tokenSecret.getBytes(StandardCharsets.UTF_8))
			.setHeaderParam("typ", "JWT")
			.compact();
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
		} catch (ExpiredJwtException e){
			log.info("만료된 토큰", e);
			throw new BusinessException(ErrorCode.AU_TOKEN_EXPIRED);
		} catch (Exception e) {
			log.info("유효하지 않은 토큰", e);
			throw new BusinessException(ErrorCode.AU_NOT_VALID_TOKEN);
		}
		return claims;
	}

	public RoomJwtTokenClaims getUUIDs(String token){
		Claims claims = getTokenClaims(token);
		return RoomJwtTokenClaims.builder()
			.roomUUID(UUID.fromString((String)claims.get("roomUUID")))
			.attendeeUUID(UUID.fromString((String)claims.get("attendeeUUID")))
			.build();
	}

}
