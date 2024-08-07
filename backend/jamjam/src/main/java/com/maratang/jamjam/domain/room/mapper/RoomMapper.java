package com.maratang.jamjam.domain.room.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.aTest.RoomTestRes;
import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.room.dto.response.RoomRes;
import com.maratang.jamjam.domain.room.entity.Room;

@Mapper
public interface RoomMapper {
	RoomMapper INSTANCE = Mappers.getMapper(RoomMapper.class);

	Room roomCreateReqToAttendee(RoomCreateReq roomCreateReq);

	List<RoomTestRes> roomListToRoomResList(List<Room> all);
	RoomRes roomToRoomRes(Room room);
}
