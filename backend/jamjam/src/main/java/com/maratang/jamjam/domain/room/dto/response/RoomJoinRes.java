package com.maratang.jamjam.domain.room.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.maratang.jamjam.domain.attendee.dto.AttendeeDTO;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.global.map.station.SubwayInfo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomJoinRes {
    UUID roomUUID;
    UUID attendeeUUID;
    String roomName;
    SubwayInfo roomCenterStart;
    LocalDateTime roomTime;
    String roomPurpose;
    UUID hostUUID;
    List<AttendeeDTO> attendees;

    public static RoomJoinRes of(UUID roomUUID, UUID attendeeUUID, Room room, SubwayInfo roomCenterStart, List<AttendeeDTO> attendees){
        return RoomJoinRes.builder()
            .roomUUID(roomUUID)
            .attendeeUUID(attendeeUUID)
            .roomName(room.getName())
            .roomCenterStart(roomCenterStart)
            .roomTime(room.getMeetingDate())
            .roomPurpose(room.getPurpose())
            .hostUUID(room.getRoomUUID())
            .attendees(attendees)
            .build();
    }
}
