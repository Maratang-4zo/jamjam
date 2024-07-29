package com.maratang.jamjam.global.room.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomJwtTokenCliams {
	private UUID roomUUID;
	private UUID AttendeeUUID;
}
