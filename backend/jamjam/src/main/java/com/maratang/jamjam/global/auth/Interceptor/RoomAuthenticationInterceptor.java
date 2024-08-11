package com.maratang.jamjam.global.auth.Interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.maratang.jamjam.global.auth.room.RoomTokenProvider;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RoomAuthenticationInterceptor implements HandlerInterceptor {
	private final RoomTokenProvider roomTokenProvider;

	@Override
	public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler) throws Exception {
		String token = roomTokenProvider.resolveToken(request);

		roomTokenProvider.validateToken(token);

		Claims claims = roomTokenProvider.getTokenClaims(token);

		request.setAttribute("roomUUID", claims.get("roomUUID"));
		request.setAttribute("attendeeUUID", claims.get("attendeeUUID"));

		return true;
	}
}
