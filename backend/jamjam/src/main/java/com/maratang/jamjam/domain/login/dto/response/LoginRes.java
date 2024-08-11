package com.maratang.jamjam.domain.login.dto.response;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.maratang.jamjam.global.auth.jwt.dto.JwtTokenDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class LoginRes {

	private String grantType;
	private String accessToken;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	private Date accessTokenExpireTime;
	private String refreshToken;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	private Date refreshTokenExpireTime;

	public static LoginRes of(JwtTokenDto jwtTokenDto) {
		return LoginRes.builder()
			.grantType(jwtTokenDto.getGrantType())
			.accessToken(jwtTokenDto.getAccessToken())
			.accessTokenExpireTime(jwtTokenDto.getAccessTokenExpireTime())
			.refreshToken(jwtTokenDto.getRefreshToken())
			.refreshTokenExpireTime(jwtTokenDto.getRefreshTokenExpireTime())
			.build();
	}

}
