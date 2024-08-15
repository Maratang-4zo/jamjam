package com.maratang.jamjam.global.auth.room.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.maratang.jamjam.global.auth.room.constant.GrantType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomJwtTokenDto {

	private String grantType;
	private String roomToken;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	private Date roomTokenExpireTime;

	public static RoomJwtTokenDto of(String roomToken, Date roomTokenExpireTime) {
		return RoomJwtTokenDto.builder()
				.grantType(GrantType.BEARER.getType())
                .roomToken(roomToken)
                .roomTokenExpireTime(roomTokenExpireTime)
                .build();
	}
}

