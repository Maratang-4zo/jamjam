package com.maratang.jamjam.domain.gamePlay.gameEngine;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

import com.maratang.jamjam.domain.gamePlay.dto.request.play.GamePlayReq;
import com.maratang.jamjam.domain.gamePlay.dto.response.play.GamePlayRes;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class RaceGame implements GameEngine {
	private final UUID gameRoundUUID;
	private final Map<UUID, Integer> playerPositions = new ConcurrentHashMap<>();
	private final AtomicReference<UUID> winner = new AtomicReference<>(null);
	private final AtomicBoolean gameEnded = new AtomicBoolean(false);

	@Override
	public void initialize() {
	}

	@Override
	public void startGame() {
	}

	@Override
	public GamePlayRes play(GamePlayReq req, UUID attendeeUUID) {
		int position = playerPositions.compute(attendeeUUID, (key, oldValue) ->
			(oldValue == null ? 0 : oldValue) + Integer.parseInt(req.getData()));

		boolean isWinner = isWinner(position);
		if (isWinner && winner.compareAndSet(null, attendeeUUID)){
			gameEnded.set(true);
		}

		return GamePlayRes.builder()
			.isGameEnded(gameEnded.get())
			.winnerUUID(winner.get())
			.gameRoundUUID(gameRoundUUID)
			.attendeeUUID(attendeeUUID)
			.data(String.valueOf(position))
			.build();
	}

	@Override
	public boolean isWinner(Object position) {
		return (int)position >= 480;
	}

	@Override
	public void endGame(UUID roomUUID, UUID winnerUUID) {

	}
}