package com.maratang.jamjam.domain.roundRecord.dto.request;

import java.util.UUID;

import lombok.Getter;

@Getter
public class RoundRecordCreateReq {

    private Integer round;
    private Long gameId;
    private UUID gameRecordUUID;
    private String stationName;
}
