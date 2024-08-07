package com.maratang.jamjam.domain.gameRecord.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameRecordResultUpdateReq {

	@NotBlank
	private String finalStationName;

}
