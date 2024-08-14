package com.maratang.jamjam.domain.room.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ThreeLoadingRes {
	private boolean isThreeStationLoading;

	public static ThreeLoadingRes of(boolean isThreeStationLoading) {
		return ThreeLoadingRes.builder()
			.isThreeStationLoading(isThreeStationLoading).build();
	}
}
