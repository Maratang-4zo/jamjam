package com.maratang.jamjam.domain.gamePlay.dto.response.round;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.gamePlay.entity.GameRound;
import com.maratang.jamjam.global.map.station.SubwayInfo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameRoundResultRes {
	private Integer round;
	private Attendee attendeeUUID;
	private String stationName;
	private SubwayInfo subwayInfo;

	public static GameRoundResultRes of(GameRound gameRound, SubwayInfo subwayInfo) {
		return GameRoundResultRes.builder()
			.round(gameRound.getRound())
            .attendeeUUID(gameRound.getWinnderAttendee())
            .stationName(gameRound.getStationName())
			.subwayInfo(subwayInfo)
            .build();
	}

}
