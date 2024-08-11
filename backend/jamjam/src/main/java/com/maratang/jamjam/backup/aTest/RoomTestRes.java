package com.maratang.jamjam.backup.aTest;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomTestRes {
	private Long roomId;
	private UUID roomUUID;
}
