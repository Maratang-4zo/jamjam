package com.maratang.jamjam.domain.durationRoute.dto;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.roundRecord.entity.RoundRecord;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DurationRouteCreateDTO {
    private Long duration;
    private String route;
    private Attendee attendee;
    private RoundRecord roundRecord;

    @Builder
    public DurationRouteCreateDTO(Long duration, String route, Attendee attendee, RoundRecord roundRecord) {
        this.duration = duration;
        this.route = route;
        this.attendee = attendee;
        this.roundRecord = roundRecord;
    }
}
