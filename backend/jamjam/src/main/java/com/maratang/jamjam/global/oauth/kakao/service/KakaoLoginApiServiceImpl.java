package com.maratang.jamjam.global.oauth.kakao.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.maratang.jamjam.global.jwt.constant.GrantType;
import com.maratang.jamjam.global.oauth.kakao.client.KakaoUserInfoClient;
import com.maratang.jamjam.global.oauth.kakao.dto.KakaoUserInfoResponseDto;
import com.maratang.jamjam.global.oauth.model.OAuthAttributes;
import com.maratang.jamjam.global.oauth.service.SocialLoginApiService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class KakaoLoginApiServiceImpl implements SocialLoginApiService {

	private final KakaoUserInfoClient kakaoUserInfoClient;
	private final String CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf8";

	@Override
	public OAuthAttributes getUserInfo(String accessToken) {
		System.out.println(accessToken);
		KakaoUserInfoResponseDto kakaoUserInfoResponseDto = kakaoUserInfoClient.getKakaoUserInfo(CONTENT_TYPE,
			GrantType.BEARER.getType() + " " + accessToken);
		log.info("Authorization Header: {}", kakaoUserInfoResponseDto);
		KakaoUserInfoResponseDto.KakaoAccount kakaoAccount = kakaoUserInfoResponseDto.getKakaoAccount();
		String providerId = kakaoUserInfoResponseDto.getId();
		String email = kakaoAccount.getEmail();
		String provider = "KAKAO";

		return OAuthAttributes.builder()
			.email(!StringUtils.hasText(email) ? kakaoUserInfoResponseDto.getId() : email)
			.name(kakaoAccount.getName())
			.nickname(kakaoAccount.getProfile().getNickname())
			.providerId(providerId)
			.provider(provider)
			.profile(kakaoAccount.getProfile().getProfileImageUrl())
			.build();
	}

}
