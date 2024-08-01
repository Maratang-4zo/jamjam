package com.maratang.jamjam.domain.voiceChat.dto.request;

import java.util.UUID;

import lombok.Getter;

@Getter
public class VoiceChatTokenReq {
	UUID roomUUID;
	UUID attendeeUUID;
}
