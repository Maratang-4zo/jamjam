package com.maratang.jamjam.domain.gamePlay.dto.response.play;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameNextRoundRes {
	private String next;

	public static GameNextRoundRes of(String next) {
        return GameNextRoundRes.builder()
                .next(next)
                .build();
    }
}
