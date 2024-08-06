package com.maratang.jamjam.domain.gameRecord.dto.request;

import com.maratang.jamjam.domain.gameRecord.entity.GameRecordStatus;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GameRecordUpdateReq {

	private String finalStationName;
	private GameRecordStatus gameRecordStatus;

}
