package com.maratang.jamjam.domain.gamePlay.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.gamePlay.dto.request.play.GamePlayReq;
import com.maratang.jamjam.domain.gamePlay.dto.request.play.GameStartReq;
import com.maratang.jamjam.domain.gamePlay.dto.response.play.GameCountdown;
import com.maratang.jamjam.domain.gamePlay.dto.response.play.GamePlayRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.play.GameWinnerRes;
import com.maratang.jamjam.domain.gamePlay.dto.response.round.GameRoundIdRes;
import com.maratang.jamjam.domain.gamePlay.entity.GameRound;
import com.maratang.jamjam.domain.gamePlay.repository.GameRoundRepository;
import com.maratang.jamjam.global.ws.BroadCastService;
import com.maratang.jamjam.global.ws.BroadCastType;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GamePlayService {
	private final GameRoundRepository gameRoundRepository;
	private final BroadCastService broadCastService;

	private final Map<UUID, ConcurrentHashMap<UUID, Long>> data = new HashMap<>();
	private final Map<UUID, UUID> winner = new ConcurrentHashMap<>();
	private final AttendeeRepository attendeeRepository;

	// 임시임시임시임시
	public void createGameRound(UUID gameRoundUUID, UUID roomUUID) {
		data.put(gameRoundUUID, new ConcurrentHashMap<>());
		// broadCastService.broadcastToRoom(gameSettingReq.getRoomUUID(), gameRound.getRoundRecordId(), BroadCastType.GAME_READY);
	}

	public void startNewGame(GameStartReq gameStartReq, UUID roomUUID){
		for (int i = 3; i > 0; i--) {
			broadCastService.broadcastToRoom(roomUUID, GameCountdown.builder().gameRoundUUID(gameStartReq.getGameRoundUUID()).countdown(i).build(), BroadCastType.GAME_COUNTDOWN);
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				Thread.currentThread().interrupt();
			}
		}
		broadCastService.broadcastToRoom(roomUUID, GameRoundIdRes.builder().gameRoundUUID(gameStartReq.getGameRoundUUID()).build(), BroadCastType.GAME_START);
	}

	public void playGame(GamePlayReq req, UUID roomUUID, UUID attendeeUUID){
		ConcurrentHashMap<UUID, Long> roundRecord = data.get(req.getGameRoundUUID());
		Long position = roundRecord.getOrDefault(attendeeUUID, 0L) + Long.parseLong(req.getData());
		roundRecord.put(attendeeUUID, position);

		broadCastService.broadcastToRoom(roomUUID, GamePlayRes.builder().gameRoundUUID(req.getGameRoundUUID()).attendeeUUID(attendeeUUID).data(String.valueOf(position)).build(), BroadCastType.GAME_PLAY);
		if(isWinner(position)){
			winner.putIfAbsent(req.getGameRoundUUID(), attendeeUUID);
			endGame(req.getGameRoundUUID(), roomUUID, attendeeUUID);
		}
	}

	public boolean isWinner(Long position){
		return position >= 480;
	}

	@Transactional
	public void endGame(UUID gameRoundUUID, UUID roomUUID, UUID attendeeUUID){
		broadCastService.broadcastToRoom(roomUUID, GameRoundIdRes.builder().gameRoundUUID(gameRoundUUID).build(), BroadCastType.GAME_END);
		broadCastService.broadcastToRoom(roomUUID, GameWinnerRes.builder().attendeeUUID(winner.get(gameRoundUUID)).build(), BroadCastType.GAME_WINNER);

		GameRound gameRound = gameRoundRepository.findByGameRoundUUID(gameRoundUUID).orElseThrow();
		Attendee attendee = attendeeRepository.findByAttendeeUUID(attendeeUUID).orElseThrow();
		gameRound.updateWinner(attendee);

		data.remove(gameRoundUUID);
		winner.remove(gameRoundUUID);

		gameRoundRepository.save(gameRound);
	}


}
