package com.maratang.jamjam.global.map.middle.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GoogleDirectionsRes {

    private List<Route> routes;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Route {
        @JsonProperty("overview_polyline")
        private OverviewPolyline overviewPolyline;
        private List<Leg> legs;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class OverviewPolyline {
        private String points;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Leg {
        private Duration duration;
        private Distance distance;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Duration {
        private String text;
        private int value;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Distance {
        private String text;
        private int value;
    }
}
