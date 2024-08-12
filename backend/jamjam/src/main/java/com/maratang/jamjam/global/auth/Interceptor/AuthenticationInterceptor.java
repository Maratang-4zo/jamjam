package com.maratang.jamjam.global.auth.Interceptor;

import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.WebUtils;

import com.maratang.jamjam.global.auth.jwt.constant.TokenType;
import com.maratang.jamjam.global.auth.jwt.manager.TokenManager;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;
import com.maratang.jamjam.global.util.AuthorizationHeaderUtils;
import com.maratang.jamjam.global.util.CookieUtils;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthenticationInterceptor implements HandlerInterceptor {

	private final TokenManager tokenManager;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws
		Exception {

		// 1. Authorization Header 검증
		String authorizationHeader = request.getHeader("Authorization");
		AuthorizationHeaderUtils.validateAuthorization(authorizationHeader);

		// 2. 토큰 검증
		String accessToken = authorizationHeader.split(" ")[1];
		String refreshToken = Objects.requireNonNull(WebUtils.getCookie(request, "refreshToken")).getValue();

		Claims tokenClaims;

		log.info("refresh"+refreshToken);
		String newAccessToken = null;


		if (!tokenManager.validateAccessToken(accessToken, request, response)) {
			if(tokenManager.validateRefreshToken(refreshToken, request, response))
				newAccessToken = tokenManager.reissueToken(refreshToken);
		}

		if (newAccessToken != null) {
			accessToken = newAccessToken;
		}

		// 3. 토큰 타입
		tokenClaims = tokenManager.getTokenClaims(accessToken);
		String tokenType = tokenClaims.getSubject();
		if (!TokenType.isAccess(tokenType)) {
			throw new AuthenticationException(ErrorCode.NOT_ACCESS_TOKEN);
		}

		if (newAccessToken != null) {
			CookieUtils.createSessionCookie(response, "accessToken", accessToken);
		}

		request.setAttribute("email", tokenClaims.get("email"));

		return true;
	}

}

