package com.maratang.jamjam.domain.attendee.dto.response;

import java.util.List;
import java.util.UUID;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.entity.AttendeeStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AttendeeInfo {
	private Long attendeeId;
	private UUID attendeeUUID;
	private String nickname;
	private Double lat;
	private Double lon;
	private AttendeeStatus attendeeStatus;
	private Long roomId;
	private Long duration;
	private String route;
	private String address;
	private String profileImageUrl;
	private boolean isRoot;

	public static AttendeeInfo of(Attendee attendee){
		return AttendeeInfo.builder()
                .attendeeId(attendee.getAttendeeId())
                .attendeeUUID(attendee.getAttendeeUUID())
                .nickname(attendee.getNickname())
                .lat(attendee.getLat())
                .lon(attendee.getLon())
                .attendeeStatus(attendee.getAttendeeStatus())
				.roomId(attendee.getRoom().getRoomId())
				.address(attendee.getAddress())
				.profileImageUrl(attendee.getProfileImageUrl() == null ? null: attendee.getProfileImageUrl().getType())
				.duration(attendee.getDuration())
				.route(attendee.getRoute())
				.isRoot(attendee.equals(attendee.getRoom().getRoot()))
                .build();
	}

	public static List<AttendeeInfo> of(List<Attendee> attendees){
		return attendees.stream().map(AttendeeInfo::of).toList();
	}
}
