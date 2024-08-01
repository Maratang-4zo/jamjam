package com.maratang.jamjam.global.oauth.kakao.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.maratang.jamjam.global.oauth.service.SocialLoginApiService;

@Service
public class SocialLoginApiServiceFactory {

	private static Map<String, SocialLoginApiService> socialLoginApiServices;

	public SocialLoginApiServiceFactory(Map<String, SocialLoginApiService> socialLoginApiServices) {
		this.socialLoginApiServices = socialLoginApiServices;
	}

	public static SocialLoginApiService getSocialLoginApiService() {
		// String socialLoginApiServiceBeanName = "";
		//
		// if (MemberType.KAKAO.equals(memberType)) {
		// 	socialLoginApiServiceBeanName = "kakaoLoginApiServiceImpl";
		// }
		return socialLoginApiServices.get("kakaoLoginApiServiceImpl");

	}

}
