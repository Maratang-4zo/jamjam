package com.maratang.jamjam.domain.room.service;

import com.maratang.jamjam.global.config.GoogleDirectionsConfig;
import com.maratang.jamjam.global.map.middle.client.GoogleDirectionsClient;
import com.maratang.jamjam.global.map.middle.dto.GoogleDirectionsRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GoogleDirectionsService {

    private final GoogleDirectionsClient googleDirectionsClient;
    private final GoogleDirectionsConfig googleDirectionsConfig;

    @Autowired
    public GoogleDirectionsService(GoogleDirectionsClient googleDirectionsClient, GoogleDirectionsConfig googleDirectionsConfig) {
        this.googleDirectionsClient = googleDirectionsClient;
        this.googleDirectionsConfig = googleDirectionsConfig;
    }

    public GoogleDirectionsRes getFixedDirections(String origin, String destination) {
        String mode = "transit";
        String apiKey = googleDirectionsConfig.getApiKey();
        String departureTime = "1723766400";
        return googleDirectionsClient.getDirections(origin, destination, mode, departureTime, apiKey);
    }
}
