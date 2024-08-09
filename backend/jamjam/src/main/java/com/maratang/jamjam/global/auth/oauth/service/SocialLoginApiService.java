package com.maratang.jamjam.global.auth.oauth.service;

import com.maratang.jamjam.global.auth.oauth.model.OAuthAttributes;

public interface SocialLoginApiService {

	OAuthAttributes getUserInfo(String accessToken);

}
