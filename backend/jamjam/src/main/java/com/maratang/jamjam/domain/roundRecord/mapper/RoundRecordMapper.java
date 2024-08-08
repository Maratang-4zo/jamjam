package com.maratang.jamjam.domain.roundRecord.mapper;

import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordCreateRequest;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordUpdateRequest;
import com.maratang.jamjam.domain.roundRecord.entity.RoundRecord;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface RoundRecordMapper {
    RoundRecordMapper INSTANCE = Mappers.getMapper(RoundRecordMapper.class);

    RoundRecord roundRecordCreateReqToRoundRecord(RoundRecordCreateRequest roundRecordCreateRequest);

    RoundRecord roundRecordUpdateReqToRoundRecord(RoundRecordUpdateRequest roundRecordUpdateRequest);
}
