package com.maratang.jamjam.domain.room.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.aTest.RoomTestRes;
import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.room.dto.response.RoomHistoryRes;
import com.maratang.jamjam.domain.room.dto.response.RoomRes;
import com.maratang.jamjam.domain.room.entity.Room;

@Mapper(componentModel = "spring")
public interface RoomMapper {

	RoomMapper INSTANCE = Mappers.getMapper(RoomMapper.class);

	// List<RoomRes> roomListToRoomResList(List<Room> all);
	List<RoomTestRes> roomListToRoomResList(List<Room> all);
	RoomRes roomToRoomRes(Room room);


	Room roomCreateReqToAttendee(RoomCreateReq roomCreateReq);

	@Mapping(target = "room.name", source = "name")
	@Mapping(target = "room.finalStation", source = "finalStation")
	@Mapping(target = "room.meetingDate", source = "meetingDate")
	@Mapping(target = "room.purpose", source = "purpose")
	RoomHistoryRes roomToRoomHistoryRes(Room room);

	List<RoomHistoryRes> roomsToRoomHistoryResList(List<Room> rooms);
}
