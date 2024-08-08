package com.maratang.jamjam.domain.roundRecord.dto.response;

import com.maratang.jamjam.global.station.SubwayInfo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoundRecordUpdateRes {
	SubwayInfo roundCenterStation;
}

