package com.maratang.jamjam.domain.room.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.room.entity.Room;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RootLeaveRes {
	private UUID attendeeUUID;
	private String nickname;
	private LocalDateTime estimatedForceCloseAt;

	public static RootLeaveRes of(Room room, Attendee attendee){
		return RootLeaveRes.builder()
			.attendeeUUID(attendee.getAttendeeUUID())
			.nickname(attendee.getNickname())
			.estimatedForceCloseAt(room.getEstimatedForceCloseAt())
			.build();
	}
}
