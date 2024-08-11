package com.maratang.jamjam.domain.room.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.maratang.jamjam.domain.room.entity.Room;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomHistoryRes {
	private String name;
	private String purpose;
	private LocalDateTime meetingDate;
	private String finalStation;

	public static RoomHistoryRes of(Room room) {
		return RoomHistoryRes.builder()
                .name(room.getName())
                .purpose(room.getPurpose())
                .meetingDate(room.getMeetingDate())
                .finalStation(room.getFinalStation())
                .build();
	}

	public static List<RoomHistoryRes> of(List<Room> rooms){
		return rooms.stream()
                .map(RoomHistoryRes::of)
                .toList();
	}
}
