package com.maratang.jamjam.domain.roundRecord.dto.request;

import lombok.Getter;

@Getter
public class RoundRecordCreateReq {

    private Integer round;
    private Long gameId;
    private Long gameRecordId;
    private String stationName;
}
