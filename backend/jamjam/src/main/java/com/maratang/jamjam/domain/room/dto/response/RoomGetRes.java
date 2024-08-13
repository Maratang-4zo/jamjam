package com.maratang.jamjam.domain.room.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.maratang.jamjam.domain.attendee.dto.response.AttendeeInfo;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.entity.RoomStatus;
import com.maratang.jamjam.global.map.station.SubwayInfo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomGetRes {
    Boolean isHost;
    UUID roomUUID;
    UUID attendeeUUID;
    String roomName;
    SubwayInfo roomCenterStart;
    LocalDateTime roomTime;
    String roomPurpose;
    UUID hostUUID;
    List<AttendeeInfo> attendees;
    RoomStatus roomStatus;

    public static RoomGetRes of(Room room, UUID attendeeUUID, SubwayInfo roomCenterStart){
        return RoomGetRes.builder()
               .isHost(room.getRoot().getAttendeeUUID().equals(attendeeUUID))
               .roomUUID(room.getRoomUUID())
               .attendeeUUID(attendeeUUID)
               .roomName(room.getName())
               .roomCenterStart(roomCenterStart)
               .roomTime(room.getMeetingDate())
               .roomPurpose(room.getPurpose())
               .hostUUID(room.getRoomUUID())
               .attendees(AttendeeInfo.of(room.getAttendees()))
                .roomStatus(room.getRoomStatus())
               .build();
    }
}
