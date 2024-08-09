package com.maratang.jamjam.domain.roundRecord.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.domain.game.repository.GameRepository;
import com.maratang.jamjam.domain.gameRecord.entity.GameRecord;
import com.maratang.jamjam.domain.gameRecord.repository.GameRecordRepository;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.domain.roundRecord.dto.RoundRecordDTO;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordCreateReq;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordGetReq;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordUpdateReq;
import com.maratang.jamjam.domain.roundRecord.dto.response.RoundRecordCreateRes;
import com.maratang.jamjam.domain.roundRecord.dto.response.RoundRecordGetRes;
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
    private final GameRepository gameRepository;
    private final GameRecordRepository gameRecordRepository;

    @Transactional
    public RoundRecordCreateRes createRoundRecord(RoundRecordCreateReq roundRecordCreateReq) {
        RoundRecord roundRecord = RoundRecordMapper.INSTANCE.roundRecordCreateReqToRoundRecord(roundRecordCreateReq);

        Game game = gameRepository.findById(roundRecordCreateReq.getGameId())
                .orElseThrow(() -> new BusinessException(ErrorCode.GAME_NOT_FOUND));

        GameRecord gameRecord = gameRecordRepository.findByUUID(roundRecordCreateReq.getGameRecordUUID())
                .orElseThrow(() -> new BusinessException(ErrorCode.GR_NOT_FOUND));

        roundRecord.updateGame(game);
        roundRecord.updateGameRecord(gameRecord);

        roundRecordRepository.save(roundRecord);

        return RoundRecordCreateRes.builder()
            .roundRecordId(roundRecord.getRoundRecordId())
            .build();
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

	public RoundRecordGetRes getRoundRecord(RoundRecordGetReq roundRecordGetReq) {
        GameRecord gameRecord = gameRecordRepository.findByUUID(roundRecordGetReq.getGameRecordUUID())
            .orElseThrow(()->new BusinessException(ErrorCode.GR_NOT_FOUND));

        List<RoundRecord> roundRecords = roundRecordRepository.findAllByGameRecordId(gameRecord.getGameRecordId());
        List<RoundRecordDTO> roundRecordList = RoundRecordDTO.of(roundRecords);

        return RoundRecordGetRes.builder()
            .roundRecordList(roundRecordList)
            .build();
	}
}
