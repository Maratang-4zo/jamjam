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

	@Mapping(source = "room.name", target = "name")
	@Mapping(source = "room.finalStation", target = "finalStation")
	@Mapping(source = "room.meetingDate", target = "meetingDate")
	@Mapping(source = "room.purpose", target = "purpose")
	RoomHistoryRes roomToRoomHistoryRes(Room room);

	@Mapping(source = "room.name", target = "name")
	@Mapping(source = "room.finalStation", target = "finalStation")
	@Mapping(source = "room.meetingDate", target = "meetingDate")
	@Mapping(source = "room.purpose", target = "purpose")
	List<RoomHistoryRes> roomsToRoomHistoryResList(List<Room> rooms);
}
