package com.maratang.jamjam.domain.attendee.dto.response;

import java.util.UUID;

import com.maratang.jamjam.domain.attendee.entity.AttendeeStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AttendeeInfo {
	private UUID attendeeUUID;
	private String nickname;
	private Double lat;
	private Double lon;
	private AttendeeStatus attendeeStatus;
}
