package com.maratang.jamjam.domain.gameRecord.dto.response;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameRecordRes {

	private UUID gameRecordUUID;

}
