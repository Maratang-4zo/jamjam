package com.maratang.jamjam.domain.voiceChat.dto.request;

import java.util.UUID;

import lombok.Getter;

@Getter
public class VoiceChatSessionReq {
	UUID roomUUID;
	UUID attendeeUUID;
}
