package com.maratang.jamjam.domain.gamePlay.dto.request.session;

import com.maratang.jamjam.domain.gamePlay.entity.GameSession;
import com.maratang.jamjam.domain.gamePlay.entity.GameSessionStatus;
import com.maratang.jamjam.domain.room.entity.Room;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameSessionCreateReq {
	private Integer roundCnt;
	private String finalStationName;

	public GameSession toEntity(Room room){
		return GameSession.builder()
			.room(room)
			.roundCnt(roundCnt)
			.finalStationName(finalStationName)
			.gameSessionStatus(GameSessionStatus.PLAYING)
			.build();
	}
}
