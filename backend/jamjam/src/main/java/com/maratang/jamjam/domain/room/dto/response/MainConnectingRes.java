package com.maratang.jamjam.domain.room.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MainConnectingRes {
	private boolean isMainConnecting;

	public static MainConnectingRes of(boolean isMainConnecting){
		return MainConnectingRes.builder()
			.isMainConnecting(isMainConnecting).build();
	}
}
