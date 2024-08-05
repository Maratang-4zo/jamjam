package com.maratang.jamjam.domain.room.dto.request;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class RoomUpdateReq {
	private LocalDateTime meetingDay;
	private String name;
	private String purpose;
}
