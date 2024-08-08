package com.maratang.jamjam.domain.roundRecord.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordCreateReq;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordUpdateReq;
import com.maratang.jamjam.domain.roundRecord.dto.response.RoundRecordUpdateRes;
import com.maratang.jamjam.domain.roundRecord.entity.RoundRecord;
import com.maratang.jamjam.domain.roundRecord.mapper.RoundRecordMapper;
import com.maratang.jamjam.domain.roundRecord.repository.RoundRecordRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.middle.client.OTPUserClient;
import com.maratang.jamjam.global.station.SubwayDataLoader;
import com.maratang.jamjam.global.station.SubwayInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoundRecordService {
    private final RoundRecordRepository roundRecordRepository;
    private final AttendeeRepository attendeeRepository;
    private final OTPUserClient oTPUserClient;
    private final RoomRepository roomRepository;
    private final SubwayDataLoader subwayDataLoader;

    @Transactional
    public void createRoundRecord(RoundRecordCreateReq roundRecordCreateReq) {
        RoundRecord roundRecord = RoundRecordMapper.INSTANCE.roundRecordCreateReqToRoundRecord(roundRecordCreateReq);

        roundRecordRepository.save(roundRecord);
    }

    @Transactional
    public RoundRecordUpdateRes updateRoundRecord(RoundRecordUpdateReq roundRecordUpdateReq) {
        RoundRecord roundRecord = roundRecordRepository.findById(roundRecordUpdateReq.getRoundRecordId())
                .orElseThrow(()->new BusinessException(ErrorCode.RR_NOT_FOUND));

        roundRecord.updateStationName(roundRecordUpdateReq.getRoundStationName());

        SubwayInfo selectedStation = subwayDataLoader.getSubwayInfo(roundRecordUpdateReq.getRoundStationName());

        return RoundRecordUpdateRes.builder()
            .roundCenterStation(selectedStation)
            .build();
    }

}
