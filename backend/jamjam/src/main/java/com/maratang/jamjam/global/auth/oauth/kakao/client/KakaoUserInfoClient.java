package com.maratang.jamjam.global.auth.oauth.kakao.client;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.maratang.jamjam.global.auth.oauth.kakao.dto.response.KakaoUserInfoRes;

@FeignClient(url = "https://kapi.kakao.com", name = "kakaoUserInfoClient")
public interface KakaoUserInfoClient {

	@GetMapping(value = "/v2/user/me", consumes = "application/json")
	KakaoUserInfoRes getKakaoUserInfo(@RequestHeader("Content-type") String contentType,
		@RequestHeader("Authorization") String accessToken);

	@PostMapping(value = "/v2/api/calendar/create/event", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	ResponseEntity<Map> createKakaoCalendarEvent(
		@RequestHeader("Authorization") String authorization,
		@RequestParam("event") String event
	);

	@PostMapping("/oauth/token")
	ResponseEntity<Map> reissueTokens(
		@RequestParam("grant_type") String grantType,
		@RequestParam("client_id") String clientId,
		@RequestParam("refresh_token") String refreshToken,
		@RequestParam("client_secret") String clientSecret
	);
}
