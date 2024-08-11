package com.maratang.jamjam.global.auth.oauth.kakao.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.maratang.jamjam.global.auth.oauth.service.SocialLoginApiService;

@Service
public class SocialLoginApiServiceFactory {

	private static Map<String, SocialLoginApiService> socialLoginApiServices;

	public SocialLoginApiServiceFactory(Map<String, SocialLoginApiService> socialLoginApiServices) {
		this.socialLoginApiServices = socialLoginApiServices;
	}

	// 확장 가능성
	public static SocialLoginApiService getSocialLoginApiService() {
		// String socialLoginApiServiceBeanName = "";
		//
		// if (MemberType.KAKAO.equals(memberType)) {
		// 	socialLoginApiServiceBeanName = "kakaoLoginApiServiceImpl";
		// }
		return socialLoginApiServices.get("kakaoLoginApiServiceImpl");

	}

}
