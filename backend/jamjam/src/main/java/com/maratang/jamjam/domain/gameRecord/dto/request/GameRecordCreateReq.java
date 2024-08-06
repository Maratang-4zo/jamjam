package com.maratang.jamjam.domain.gameRecord.dto.request;

import java.util.UUID;

import com.maratang.jamjam.domain.gameRecord.entity.GameRecordStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameRecordCreateReq {

	private Integer roundCnt;
	private UUID roomUUID;
	private String finalStationName;
	private GameRecordStatus gameRecordStatus;

}
