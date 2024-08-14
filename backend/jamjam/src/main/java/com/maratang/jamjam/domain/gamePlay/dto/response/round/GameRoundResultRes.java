package com.maratang.jamjam.domain.gamePlay.dto.response.round;

import java.util.List;
import java.util.UUID;

import com.maratang.jamjam.domain.gamePlay.entity.GameRound;
import com.maratang.jamjam.global.map.station.SubwayInfo;
import com.maratang.jamjam.global.map.station.SubwayLine;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameRoundResultRes {
	private Integer round;
	private UUID attendeeUUID;
	private String stationName;
	private List<SubwayLine> subwayLines;

	public static GameRoundResultRes of(GameRound gameRound, SubwayInfo subwayInfo) {
		return GameRoundResultRes.builder()
			.round(gameRound.getRound())
            .attendeeUUID(gameRound.getWinnderAttendee().getAttendeeUUID())
            .stationName(gameRound.getStationName())
			.subwayLines(subwayInfo.getSubwayLines())
            .build();
	}

}
