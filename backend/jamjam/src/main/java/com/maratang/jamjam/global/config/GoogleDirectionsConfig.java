package com.maratang.jamjam.global.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class GoogleDirectionsConfig {

    @Value("${google.directions.api.key}")
    private String apiKey;

}