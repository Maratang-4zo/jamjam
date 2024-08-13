package com.maratang.jamjam.domain.room.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.entity.RoomStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomRes {
	UUID roomUUID;
	LocalDateTime meetingDate;
	String purpose;
	RoomStatus roomStatus;

	public static RoomRes of(Room room) {
		return RoomRes.builder()
                .roomUUID(room.getRoomUUID())
                .meetingDate(room.getMeetingDate())
                .purpose(room.getPurpose())
				.roomStatus(room.getRoomStatus())
                .build();
	}
}
