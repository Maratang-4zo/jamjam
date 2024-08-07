package com.maratang.jamjam.domain.room.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomRes {
	UUID roomUUID;
	LocalDateTime meetingDate;
	String purpose;
}
