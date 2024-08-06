package com.maratang.jamjam.domain.attendee.dto;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.maratang.jamjam.domain.attendee.entity.Attendee;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AttendeeDTO {
    private String address;
    private Double lat;
    private Double lon;
    private String nickname;
    private Long duration;
    private String route;
    private UUID attendeeUUID;
    private String profileImageUrl;


    public static AttendeeDTO of(Attendee attendee) {
        return new AttendeeDTO(
            attendee.getAddress(),
            attendee.getLat(),
            attendee.getLon(),
            attendee.getNickname(),
            attendee.getDuration(),
            attendee.getRoute(),
            attendee.getAttendeeUUID(),
            attendee.getProfileImageUrl().getType() // ProfileType의 type 속성 값을 가져옴
        );
    }

    public static List<AttendeeDTO> of(List<Attendee> attendees) {
        return attendees.stream()
            .map(AttendeeDTO::of)
            .collect(Collectors.toList());
    }
}
