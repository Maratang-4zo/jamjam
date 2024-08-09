package com.maratang.jamjam.domain.room.dto.response;

import com.maratang.jamjam.domain.attendee.dto.AttendeeDTO;
import com.maratang.jamjam.global.map.station.SubwayInfo;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class RoomJoinRes {
    UUID RoomUUID;
    UUID AttendeeUUID;
    String roomName;
    SubwayInfo roomCenterStart;
    LocalDateTime roomTime;
    String roomPurpose;
    UUID hostUUID;
    List<AttendeeDTO> attendees;
}
