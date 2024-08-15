package com.maratang.jamjam.global.auth.Interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.WebUtils;

import com.maratang.jamjam.global.auth.jwt.manager.LoginTokenManager;
import com.maratang.jamjam.global.util.AuthorizationHeaderUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthenticationInterceptor implements HandlerInterceptor {

	private final LoginTokenManager loginTokenManager;

	private static final String AUTHORIZATION_HEADER = "Authorization";
	private static final String BEARER_PREFIX = "Bearer ";
	private static final String REFRESH_TOKEN_COOKIE = "refreshToken";

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws
		Exception {

		// 1. Authorization Header 검증
		String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);
		AuthorizationHeaderUtils.validateAuthorization(authorizationHeader);

		// 2. 토큰 검증
		String accessToken = extractAccessToken(authorizationHeader);
		String refreshToken = extractRefreshToken(request);

		log.info("accessToken나오나요? "+accessToken);
		log.info("refreshToken나오나요? "+refreshToken);

		accessToken = loginTokenManager.validateAndRefreshTokenIfNeeded(accessToken, refreshToken, request, response);

		// 3. 토큰 타입
		String email = loginTokenManager.getMemberEmail(accessToken);

		request.setAttribute("email", email);

		return true;
	}

	private String extractAccessToken(String authorizationHeader) {
		return authorizationHeader.substring(BEARER_PREFIX.length());
	}

	private String extractRefreshToken(HttpServletRequest request) {
		Cookie refreshTokenCookie = WebUtils.getCookie(request, REFRESH_TOKEN_COOKIE);
		return refreshTokenCookie != null ? refreshTokenCookie.getValue() : null;
	}

}

