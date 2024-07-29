package com.maratang.jamjam.domain.room.dto.request;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class RoomUpdateReq {
	private Long roomId;
	private LocalDateTime meeting_day;
	private String name;
	private String purpose;
}
