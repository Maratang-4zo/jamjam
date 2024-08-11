package com.maratang.jamjam.domain.chat.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.maratang.jamjam.domain.chat.entity.Chat;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ChatRes {
	private UUID attendeeUUID;
	private String content;
	private LocalDateTime createdAt;

	public static ChatRes of(Chat chat) {
		return ChatRes.builder()
			.attendeeUUID(chat.getAttendee().getAttendeeUUID())
			.content(chat.getContent())
			.createdAt(chat.getCreatedAt())
			.build();
	}
}
