package com.maratang.jamjam.global.auth.room.dto;

import java.util.UUID;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.room.dto.response.RoomJoinRes;
import com.maratang.jamjam.domain.room.entity.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomJwtTokenClaims {
	private UUID roomUUID;
	private UUID attendeeUUID;

	public static RoomJwtTokenClaims of(Room room, Attendee attendee) {
		return RoomJwtTokenClaims.builder()
                .roomUUID(room.getRoomUUID())
                .attendeeUUID(attendee.getAttendeeUUID())
                .build();
	}

	public static RoomJwtTokenClaims of(RoomJoinRes res){
		return RoomJwtTokenClaims.builder()
				.roomUUID(res.getRoomUUID())
				.attendeeUUID(res.getAttendeeUUID())
				.build();
	}
}
