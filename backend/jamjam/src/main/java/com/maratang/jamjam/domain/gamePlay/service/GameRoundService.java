package com.maratang.jamjam.domain.gamePlay.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.game.entity.Game;
import com.maratang.jamjam.domain.game.repository.GameRepository;
import com.maratang.jamjam.domain.gamePlay.dto.request.play.GameNextRoundReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.round.GameRoundCreateReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.round.GameRoundUpdateReq;
import com.maratang.jamjam.domain.gamePlay.dto.response.play.GameNextRoundRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.round.GameRoundCreateRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.round.GameRoundStationRes;
import com.maratang.jamjam.domain.gamePlay.entity.GameRound;
import com.maratang.jamjam.domain.gamePlay.entity.GameSession;
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
        Game game = gameRepository.findById(gameRoundCreateReq.getGameId())
            .orElseThrow(() -> new BusinessException(ErrorCode.GAME_NOT_FOUND));

        GameSession gameSession = gameSessionRepository.findByGameSessionUUID(gameRoundCreateReq.getGameSessionUUID())
            .orElseThrow(() -> new BusinessException(ErrorCode.GR_NOT_FOUND));

        GameRound gameRound = gameRoundCreateReq.toEntity(game, gameSession);

        GameRound gameRound2 = gameRoundRepository.save(gameRound);

        return GameRoundCreateRes.of(gameRound2.getGameRoundUUID());
    }

    @Transactional
    public GameRoundStationRes updateRoundRecord(GameRoundUpdateReq req) {
        GameRound gameRound = gameRoundRepository.findByGameRoundUUID(req.getGameRoundUUID())
            .orElseThrow(()->new BusinessException(ErrorCode.RR_NOT_FOUND));

        gameRound.updateStationName(req.getRoundStationName());

        SubwayInfo selectedStation = subwayDataLoader.getSubwayInfo(req.getRoundStationName());

        return GameRoundStationRes.of(req.getGameRoundUUID(), selectedStation);
    }



    public GameNextRoundRes nextRound(GameNextRoundReq req, UUID roomUUID) {
        // fixme
        return GameNextRoundRes.of(req.getCurrentRound() == req.getTotalRound() ? "finalResult" : "nextRound");
    }
}
