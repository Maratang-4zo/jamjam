package com.maratang.jamjam.domain.durationRoute.entity;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.roundRecord.entity.RoundRecord;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "duationRoute")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DurationRoute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT UNSIGNED")
    private Long durationRouteId;

    private Long duration; // 소요시간 (단위: 초)
    private String route; // 경로

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendee_id")
    private Attendee attendee;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "round_record_id")
    private RoundRecord roundRecord;

    @Builder
    public DurationRoute(Long durationRouteId, Long duration, String route, Attendee attendee, RoundRecord roundRecord) {
        this.durationRouteId = durationRouteId;
        this.duration = duration;
        this.route = route;
        this.attendee = attendee;
        this.roundRecord = roundRecord;
    }

    public void updateDuration(Long duration) {
        this.duration = duration;
    }

    public void updateRoute(String route) {
        this.route = route;
    }
}
