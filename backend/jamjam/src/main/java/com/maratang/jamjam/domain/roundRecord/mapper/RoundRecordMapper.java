package com.maratang.jamjam.domain.roundRecord.mapper;

import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordCreateReq;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordUpdateReq;
import com.maratang.jamjam.domain.roundRecord.entity.RoundRecord;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface RoundRecordMapper {
    RoundRecordMapper INSTANCE = Mappers.getMapper(RoundRecordMapper.class);

    RoundRecord roundRecordCreateReqToRoundRecord(RoundRecordCreateReq roundRecordCreateReq);

    RoundRecord roundRecordUpdateReqToRoundRecord(RoundRecordUpdateReq roundRecordUpdateReq);
}
