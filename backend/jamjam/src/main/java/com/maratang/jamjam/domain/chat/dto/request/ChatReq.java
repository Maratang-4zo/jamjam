package com.maratang.jamjam.domain.chat.dto.request;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.chat.entity.Chat;
import com.maratang.jamjam.domain.room.entity.Room;

import lombok.Getter;

@Getter
public class ChatReq {
	private String content;

	public Chat toEntity(Room room, Attendee attendee) {
        return Chat.builder()
			.content(content)
			.room(room)
			.attendee(attendee)
			.build();
    }
}
