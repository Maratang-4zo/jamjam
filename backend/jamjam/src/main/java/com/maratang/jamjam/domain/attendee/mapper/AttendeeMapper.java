package com.maratang.jamjam.domain.attendee.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeCreateReq;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.attendee.dto.response.AttendeeInfo;

@Mapper
public interface AttendeeMapper {
    AttendeeMapper INSTANCE = Mappers.getMapper(AttendeeMapper.class);

    Attendee attendeeCreateReqToAttendee(RoomCreateReq roomCreateReq);

    Attendee attendeeCreateReqToAttendee(AttendeeCreateReq attendeeCreateReq);

    AttendeeInfo attendeeToAttendeeInfo(Attendee attendee);

    List<AttendeeInfo> attendeeListToAttendeeInfoList(List<Attendee> attendees);
}
