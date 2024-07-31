package com.maratang.jamjam.domain.attendee.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeCreateReq;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.room.entity.Room;

@Mapper
public interface AttendeeMapper {
    AttendeeMapper INSTANCE = Mappers.getMapper(AttendeeMapper.class);

    Attendee attendeeCreateReqToAttendee(AttendeeCreateReq attendeeCreateReq);

    Attendee attendeeCreateReqToAttendee(String nickname, Room room);
}
