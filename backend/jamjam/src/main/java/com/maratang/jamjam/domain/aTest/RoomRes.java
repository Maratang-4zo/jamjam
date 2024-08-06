package com.maratang.jamjam.domain.aTest;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomRes {
	private Long roomId;
	private UUID roomUUID;
}
