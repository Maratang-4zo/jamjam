package com.maratang.jamjam.domain.attendee.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeCreateReq;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.room.entity.Room;

@Mapper
public interface AttendeeMapper {
    public static AttendeeMapper INSTANCE = Mappers.getMapper(AttendeeMapper.class);

    public abstract Attendee attendeeCreateReqToAttendee(String nickname, Room room);

}
