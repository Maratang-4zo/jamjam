package com.maratang.jamjam.domain.room.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.maratang.jamjam.domain.attendee.dto.AttendeeDTO;
import com.maratang.jamjam.global.station.SubwayInfo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomGetRes {
    Boolean isHost;
    UUID RoomUUID;
    String roomName;
    SubwayInfo roomCenterStart;
    LocalDateTime roomTime;
    String roomPurpose;
    UUID hostUUID;
    List<AttendeeDTO> attendees;
}
