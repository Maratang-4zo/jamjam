package com.maratang.jamjam.domain.gamePlay.dto.response.round;

import java.util.UUID;

import com.maratang.jamjam.global.map.station.SubwayInfo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameRoundStationRes {
	private UUID gameRoundUUID;
	private SubwayInfo roundCenterStation;
}
