package com.maratang.jamjam.domain.chat.dto.response;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ChatRes {
	private UUID attendeeUUID;
	private String content;
	private String type;
}
