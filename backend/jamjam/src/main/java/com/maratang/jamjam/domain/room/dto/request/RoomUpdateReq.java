package com.maratang.jamjam.domain.room.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RoomUpdateReq {
	private LocalDateTime meetingDay;
	private String name;
	private String purpose;
}
