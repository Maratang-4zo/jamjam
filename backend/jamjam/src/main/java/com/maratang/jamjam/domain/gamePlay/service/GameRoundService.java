package com.maratang.jamjam.domain.gamePlay.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.domain.game.repository.GameRepository;
import com.maratang.jamjam.domain.gamePlay.dto.request.round.GameRoundCreateReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.round.GameRoundReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.round.GameRoundUpdateReq;
import com.maratang.jamjam.domain.gamePlay.dto.response.round.GameRoundResultRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.round.GameRoundCreateRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.round.GameRoundResultListRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.round.GameRoundStationRes;
import com.maratang.jamjam.domain.gamePlay.entity.GameRound;
import com.maratang.jamjam.domain.gamePlay.entity.GameSession;
import com.maratang.jamjam.domain.gamePlay.mapper.GameRoundMapper;
import com.maratang.jamjam.domain.gamePlay.repository.GameRoundRepository;
import com.maratang.jamjam.domain.gamePlay.repository.GameSessionRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.map.station.SubwayDataLoader;
import com.maratang.jamjam.global.map.station.SubwayInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GameRoundService {
    private final GameRoundRepository gameRoundRepository;
    private final SubwayDataLoader subwayDataLoader;
    private final GameSessionRepository gameSessionRepository;
    private final GameRepository gameRepository;

    @Transactional
    public GameRoundCreateRes createGameRound(GameRoundCreateReq gameRoundCreateReq) {
        GameRound gameRound = GameRoundMapper.INSTANCE.roundRecordCreateReqToRoundRecord(gameRoundCreateReq);

        Game game = gameRepository.findById(gameRoundCreateReq.getGameId())
            .orElseThrow(() -> new BusinessException(ErrorCode.GAME_NOT_FOUND));

        GameSession gameSession = gameSessionRepository.findByGameSessionUUID(gameRoundCreateReq.getGameSessionUUID())
            .orElseThrow(() -> new BusinessException(ErrorCode.GR_NOT_FOUND));

        gameRound.updateGame(game);
        gameRound.updateGameRecord(gameSession);

        GameRound gameRound2 = gameRoundRepository.save(gameRound);

        return GameRoundCreateRes.builder()
            .gameRoundUUID(gameRound2.getGameRoundUUID())
            .build();
    }

    @Transactional
    public GameRoundStationRes updateRoundRecord(GameRoundUpdateReq req) {
        GameRound gameRound = gameRoundRepository.findByGameRoundUUID(req.getGameRoundUUID())
            .orElseThrow(()->new BusinessException(ErrorCode.RR_NOT_FOUND));

        gameRound.updateStationName(req.getRoundStationName());

        SubwayInfo selectedStation = subwayDataLoader.getSubwayInfo(req.getRoundStationName());

        return GameRoundStationRes.builder()
            .roundCenterStation(selectedStation)
            .build();
    }

    public GameRoundResultListRes getRoundRecord(GameRoundReq gameRoundReq) {
        GameSession gameSession = gameSessionRepository.findByGameSessionUUID(gameRoundReq.getGameSessionUUID())
            .orElseThrow(()->new BusinessException(ErrorCode.GR_NOT_FOUND));

        List<GameRound> gameRounds = gameRoundRepository.findAllByGameSessionId(gameSession.getGameSessionId());
        List<GameRoundResultRes> gameRoundResultResList = GameRoundResultRes.of(gameRounds);

        return GameRoundResultListRes.builder()
            .gameRoundResultResList(gameRoundResultResList)
            .build();
    }

}
