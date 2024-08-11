package com.maratang.jamjam.backup.aTest;

import java.util.List;
import java.util.UUID;

import com.maratang.jamjam.domain.room.entity.Room;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomTestRes {
	private Long roomId;
	private UUID roomUUID;

	public static RoomTestRes of(Room room) {
		return RoomTestRes.builder()
			.roomId(room.getRoomId())
			.roomUUID(room.getRoomUUID())
			.build();
	}

	public static List<RoomTestRes> of(List<Room> rooms){
		return rooms.stream().map(RoomTestRes::of).toList();
	}
}
