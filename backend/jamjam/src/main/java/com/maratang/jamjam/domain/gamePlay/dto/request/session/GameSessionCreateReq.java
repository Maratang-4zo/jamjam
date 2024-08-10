package com.maratang.jamjam.domain.gamePlay.dto.request.session;

import java.util.UUID;

import com.maratang.jamjam.domain.gamePlay.entity.GameSessionStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameSessionCreateReq {
	private Integer roundCnt;
	private UUID roomUUID;
	private String finalStationName;
	private GameSessionStatus gameSessionStatus;
}
