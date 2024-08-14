package com.maratang.jamjam.domain.attendee.dto;

import java.util.List;
import java.util.UUID;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.entity.AttendeeStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AttendeeDTO {
    private String address;
    private Double lat;
    private Double lon;
    private String nickname;
    private Long duration;
    private String route;
    private UUID attendeeUUID;
    private String profileImageUrl;
    private AttendeeStatus status;


    public static AttendeeDTO of(Attendee attendee) {
        return AttendeeDTO.builder().
            address(attendee.getAddress())
            .lat(attendee.getLat())
            .lon(attendee.getLon())
            .nickname(attendee.getNickname())
            .duration(attendee.getDuration())
            .route(attendee.getRoute())
            .attendeeUUID(attendee.getAttendeeUUID())
            .profileImageUrl(attendee.getProfileImageUrl().getType())
            .status(attendee.getAttendeeStatus())
            .build();
    }

    public static List<AttendeeDTO> of(List<Attendee> attendees) {
        return attendees.stream()
            .map(AttendeeDTO::of)
            .toList();
    }
}
