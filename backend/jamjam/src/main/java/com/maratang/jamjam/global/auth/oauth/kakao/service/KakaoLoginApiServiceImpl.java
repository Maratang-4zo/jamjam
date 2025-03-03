package com.maratang.jamjam.global.auth.oauth.kakao.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.maratang.jamjam.global.auth.jwt.constant.GrantType;
import com.maratang.jamjam.global.auth.oauth.model.OAuthAttributes;
import com.maratang.jamjam.global.auth.oauth.service.SocialLoginApiService;
import com.maratang.jamjam.global.auth.oauth.kakao.client.KakaoUserInfoClient;
import com.maratang.jamjam.global.auth.oauth.kakao.dto.response.KakaoUserInfoRes;

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
		KakaoUserInfoRes kakaoUserInfoRes = kakaoUserInfoClient.getKakaoUserInfo(CONTENT_TYPE,
			GrantType.BEARER.getType() + " " + accessToken);
		log.info("Authorization Header: {}", kakaoUserInfoRes);
		KakaoUserInfoRes.KakaoAccount kakaoAccount = kakaoUserInfoRes.getKakaoAccount();
		String providerId = kakaoUserInfoRes.getId();
		String email = kakaoAccount.getEmail();
		String provider = "KAKAO";

		return OAuthAttributes.builder()
			.email(!StringUtils.hasText(email) ? kakaoUserInfoRes.getId() : email)
			.name(kakaoAccount.getProfile().getNickname())
			.nickname(kakaoAccount.getProfile().getNickname())
			.providerId(providerId)
			.provider(provider)
			.profile(kakaoAccount.getProfile().getProfileImageUrl())
			.build();
	}

}
