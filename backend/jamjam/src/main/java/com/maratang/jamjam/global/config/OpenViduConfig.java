package com.maratang.jamjam.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.openvidu.java.client.OpenVidu;

@Configuration
public class OpenViduConfig {
	@Value("${openvidu.openvidu-url}")
	private String OPENVIDU_URL;

	@Value("${openvidu.openvidu-secret}")
	private String OPENVIDU_SECRET;

	@Bean
	public OpenVidu openviduClient() {
		return new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
	}
}
