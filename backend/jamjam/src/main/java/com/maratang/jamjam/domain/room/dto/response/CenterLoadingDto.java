package com.maratang.jamjam.domain.room.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CenterLoadingDto {
	private boolean isFindCenterLoading;

	public static CenterLoadingDto of(boolean isFindCenterLoading) {
		return CenterLoadingDto.builder()
                .isFindCenterLoading(isFindCenterLoading)
                .build();
	}
}
