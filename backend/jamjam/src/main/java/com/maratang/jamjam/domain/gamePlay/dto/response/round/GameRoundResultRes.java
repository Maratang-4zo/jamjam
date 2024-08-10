package com.maratang.jamjam.domain.gamePlay.dto.response.round;

import java.util.List;
import java.util.stream.Collectors;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.gamePlay.entity.GameRound;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GameRoundResultRes {

	private Integer round;
	private Attendee WinnerAttendee;
	private String stationName;

	public static GameRoundResultRes of(GameRound gameRound) {
		return new GameRoundResultRes(
			gameRound.getRound(),
			gameRound.getWinnderAttendee(),
			gameRound.getStationName()
		);
	}

	public static List<GameRoundResultRes> of(List<GameRound> gameRounds) {
		return gameRounds.stream()
			.map(GameRoundResultRes::of)
			.collect(Collectors.toList());
	}
}
