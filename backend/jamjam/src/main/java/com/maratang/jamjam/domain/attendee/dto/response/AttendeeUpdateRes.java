package com.maratang.jamjam.domain.attendee.dto.response;

import java.util.UUID;

import com.maratang.jamjam.domain.attendee.entity.Attendee;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AttendeeUpdateRes {
	private UUID attendeeUUID;
	private String address;
	private Double lat;
	private Double lon;
	private boolean isAllHasDeparture;
	private boolean isCenterExist;

	public static AttendeeUpdateRes of(Attendee attendee, boolean isAllHasDeparture, boolean isCenterExist) {
		return AttendeeUpdateRes.builder()
                .attendeeUUID(attendee.getAttendeeUUID())
                .address(attendee.getAddress())
                .lat(attendee.getLat())
                .lon(attendee.getLon())
				.isAllHasDeparture(isAllHasDeparture)
				.isCenterExist(isCenterExist)
                .build();
	}
}
