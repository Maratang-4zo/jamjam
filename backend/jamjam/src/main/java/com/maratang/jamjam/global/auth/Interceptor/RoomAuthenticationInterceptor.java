package com.maratang.jamjam.global.auth.Interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.WebUtils;

import com.maratang.jamjam.global.auth.jwt.manager.LoginTokenManager;
import com.maratang.jamjam.global.auth.room.RoomTokenManager;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenClaims;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RoomAuthenticationInterceptor implements HandlerInterceptor {
	private final RoomTokenManager roomTokenManager;
	private final LoginTokenManager loginTokenManager;

	@Override
	public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler) throws Exception {
		authenticateUser(request, response);

		if(!request.getRequestURI().endsWith("/join") && !request.getRequestURI().equals("/api/rooms")){
			authenticateRoom(request);
		}
		return true;
	}

	public String resolveToken(HttpServletRequest request, String tokenName){
		Cookie cookie = WebUtils.getCookie(request, tokenName);
		return cookie != null ? cookie.getValue() : null;
	}

	private void authenticateRoom(HttpServletRequest request) {
		String token = resolveToken(request, "roomToken");

		RoomJwtTokenClaims claims = roomTokenManager.getRoomClaims(token);
		request.setAttribute("roomUUID", claims.getRoomUUID());
		request.setAttribute("attendeeUUID", claims.getAttendeeUUID());
	}

	public void authenticateUser(HttpServletRequest request, HttpServletResponse response) {
		Cookie accessCookie = WebUtils.getCookie(request, "accessToken");
		Cookie refreshCookie = WebUtils.getCookie(request, "refreshToken");

		if (accessCookie == null || refreshCookie == null) {
			request.setAttribute("email", "");
			return;
		}

		String accessToken = accessCookie.getValue();
		String refreshToken = refreshCookie.getValue();

		accessToken = loginTokenManager.validateAndRefreshTokenIfNeeded(accessToken, refreshToken, response);

		// 3. 토큰 타입
		String email = loginTokenManager.getMemberEmail(accessToken);

		request.setAttribute("email", email);
	}
}
