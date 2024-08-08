package com.maratang.jamjam.domain.roundRecord.dto.request;

import lombok.Getter;

@Getter
public class RoundRecordCreateRequest {

    private Integer round;
    private Long gameId;
    private Long gameRecordId;
    private String stationName;
}
