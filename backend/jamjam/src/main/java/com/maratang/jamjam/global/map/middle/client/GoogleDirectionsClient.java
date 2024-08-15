package com.maratang.jamjam.global.map.middle.client;

import com.maratang.jamjam.global.map.middle.dto.GoogleDirectionsRes;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(url = "${google.directions.api.url}", name = "GoogleDirectionsClient")
public interface GoogleDirectionsClient {

    @GetMapping(value = "/maps/api/directions/json", produces = "application/json")
    GoogleDirectionsRes getDirections(
            @RequestParam("origin") String origin,
            @RequestParam("destination") String destination,
            @RequestParam("mode") String mode,
            @RequestParam("departure_time") String departureTime,
            @RequestParam("key") String apiKey
    );
}
