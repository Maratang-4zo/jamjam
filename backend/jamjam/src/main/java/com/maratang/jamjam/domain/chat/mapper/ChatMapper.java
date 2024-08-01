package com.maratang.jamjam.domain.chat.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.chat.dto.request.ChatReq;
import com.maratang.jamjam.domain.chat.entity.Chat;
import com.maratang.jamjam.domain.room.entity.Room;

@Mapper
public interface ChatMapper {
	ChatMapper INSTANCE = Mappers.getMapper(ChatMapper.class);

	@Mapping(source = "room", target = "room")
	@Mapping(source = "attendee", target = "attendee")
	Chat chatReqToChat(ChatReq chatReq, Room room, Attendee attendee);
}