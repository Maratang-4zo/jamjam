package com.maratang.jamjam.domain.gameRecord.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class GameRecordReq {

	@NotBlank
	private Integer roundCnt;
	private UUID roomUUID;
	private String finalStationName;

}
