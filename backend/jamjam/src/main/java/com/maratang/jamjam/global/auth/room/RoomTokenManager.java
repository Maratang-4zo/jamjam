package com.maratang.jamjam.global.auth.room;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import com.maratang.jamjam.global.auth.common.CommonTokenProvider;
import com.maratang.jamjam.global.auth.jwt.constant.TokenType;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenClaims;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenDto;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import io.jsonwebtoken.Claims;
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
public class RoomTokenManager {

	public static final String TOKEN_NAME = "roomToken";

	@Value("${jwt.roomTokenExpiration:60000000000000}")
	private String roomTokenExpirationTime;

	// openssl rand -hex 32
	@Value("${jwt.secretKey:anEWd0LXRvaFGFasdQF1432ghSDASGLXNlYd12AesEgeasdfqSDGDGwe3JAEldA==}")
	private String tokenSecret;

	private final CommonTokenProvider tokenProvider;

	private final String tokenName = "roomToken";

	public String resolveToken(HttpServletRequest request){
		Cookie cookie = WebUtils.getCookie(request, tokenName);
		return cookie != null ? cookie.getValue() : null;
	}

	public RoomJwtTokenDto createRoomJwtToken(RoomJwtTokenClaims roomJwtTokenClaims) {
		Date roomTokenExpireTime = tokenProvider.createTokenExpireTime(roomTokenExpirationTime);
		String roomToken = createRoomToken(roomJwtTokenClaims, roomTokenExpireTime);

		log.info(roomToken);

		return RoomJwtTokenDto.of(roomToken, roomTokenExpireTime);
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

	public RoomJwtTokenClaims getUUIDs(String token){
		Claims claims = tokenProvider.getTokenClaims(token, tokenSecret);
		return RoomJwtTokenClaims.builder()
			.roomUUID(UUID.fromString((String)claims.get("roomUUID")))
			.attendeeUUID(UUID.fromString((String)claims.get("attendeeUUID")))
			.build();
	}

	public Claims getTokenClaims(String token){
		return tokenProvider.getTokenClaims(token, tokenSecret);
	}

	public RoomJwtTokenClaims getRoomClaims(String token){
		if(!tokenProvider.validateToken(token, TokenType.ROOM, tokenSecret)){
			throw new BusinessException(ErrorCode.UNAUTHORIZED);
		}
		Claims claims = tokenProvider.getTokenClaims(token, tokenSecret);
		return RoomJwtTokenClaims.of(UUID.fromString((String)claims.get("roomUUID")), UUID.fromString((String)claims.get("attendeeUUID")));
	}

	public boolean hasRoomToken(HttpServletRequest request, UUID roomUUID){
		try{
			String token = resolveToken(request);
			if(token != null){
				RoomJwtTokenClaims claims = getRoomClaims(token);
				if(roomUUID.equals(claims.getRoomUUID())){
					return true;
				}
			}
		} catch (Exception ignored){
		}
		return false;
	}
}
