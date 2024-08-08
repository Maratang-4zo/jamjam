package com.maratang.jamjam.domain.room.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomHistoryRes {
	private String name;
	private String purpose;
	private LocalDateTime meetingDate;
	private String finalStation;
}
