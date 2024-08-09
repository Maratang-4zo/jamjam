package com.maratang.jamjam.global.auth.Interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.maratang.jamjam.global.auth.jwt.manager.TokenManager;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;
import com.maratang.jamjam.global.auth.jwt.constant.TokenType;
import com.maratang.jamjam.global.util.AuthorizationHeaderUtils;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
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
		String authorizationHeader;
		try {
			authorizationHeader = request.getHeader("Authorization");
		}catch (Exception e) {
			throw new AuthenticationException(ErrorCode.ACCESS_TOKEN_NOT_FOUND);
		}
		AuthorizationHeaderUtils.validateAuthorization(authorizationHeader);

		// 2. 토큰 검증
		String accessToken = authorizationHeader.split(" ")[1];
		Claims tokenClaims;

		log.info("여기는 들림?"+accessToken);
		Cookie[] cookies = request.getCookies();

		String refreshToken = null;

		if (cookies != null) {
			for(Cookie cookie : cookies) {
				if(cookie.getName().equals("refreshToken")) {
					refreshToken = cookie.getValue();
					break;
				}
			}
		}

		log.info("refresh"+refreshToken);
		String newAccessToken = null;

		if (!tokenManager.validateAccessToken(accessToken)) {
			if(tokenManager.validateRefreshToken(refreshToken))
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
			Cookie aceessTokenCookie = new Cookie("accessToken", accessToken);
			aceessTokenCookie.setPath("/");
			response.addCookie(aceessTokenCookie);
		}

		request.setAttribute("email", tokenClaims.get("email"));

		return true;
	}

}

