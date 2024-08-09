package com.maratang.jamjam.domain.roundRecord.dto.response;

import java.util.List;

import com.maratang.jamjam.domain.roundRecord.dto.RoundRecordDTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoundRecordGetRes {

    List<RoundRecordDTO> roundRecordList;
}
