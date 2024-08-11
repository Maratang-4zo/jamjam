package com.maratang.jamjam.domain.gamePlay.dto.response.round;

import java.util.List;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.gamePlay.entity.GameRound;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameRoundResultRes {
	private Integer round;
	private Attendee winnerAttendee;
	private String stationName;

	public static GameRoundResultRes of(GameRound gameRound) {
		return GameRoundResultRes.builder()
			.round(gameRound.getRound())
            .winnerAttendee(gameRound.getWinnderAttendee())
            .stationName(gameRound.getStationName())
            .build();
	}

	public static List<GameRoundResultRes> of(List<GameRound> gameRounds) {
		return gameRounds.stream()
			.map(GameRoundResultRes::of)
			.toList();
	}
}
