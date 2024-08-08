package com.maratang.jamjam.domain.room.dto.response;

import java.util.List;

import com.maratang.jamjam.domain.attendee.dto.AttendeeDTO;
import com.maratang.jamjam.global.station.SubwayInfo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomMoveRes {
	SubwayInfo roomCenterStart;
	List<AttendeeDTO> attendees;
}
