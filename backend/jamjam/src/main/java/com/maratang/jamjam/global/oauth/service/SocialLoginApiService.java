package com.maratang.jamjam.global.oauth.service;

import com.maratang.jamjam.global.oauth.model.OAuthAttributes;

public interface SocialLoginApiService {

	OAuthAttributes getUserInfo(String accessToken);
	
}
