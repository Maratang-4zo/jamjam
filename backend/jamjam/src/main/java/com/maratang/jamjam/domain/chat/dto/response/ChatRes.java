package com.maratang.jamjam.domain.chat.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ChatRes {
	private String nickname;
	private String content;
	private String type;
}
