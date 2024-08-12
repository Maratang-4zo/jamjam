package com.maratang.jamjam.global.auth.Interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.WebUtils;

import com.maratang.jamjam.global.auth.jwt.manager.TokenManager;
import com.maratang.jamjam.global.auth.room.RoomTokenProvider;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.util.CookieUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RoomAuthenticationInterceptor implements HandlerInterceptor {
	private final RoomTokenProvider roomTokenProvider;
	private final TokenManager tokenManager;

	@Override
	public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler) throws Exception {
		String token = roomTokenProvider.resolveToken(request);

		if(!roomTokenProvider.validateToken(token)){
			throw new BusinessException(ErrorCode.UNAUTHORIZED);
		};

		Claims claims = roomTokenProvider.getTokenClaims(token);

		request.setAttribute("roomUUID", claims.get("roomUUID"));
		request.setAttribute("attendeeUUID", claims.get("attendeeUUID"));

		checkLoginToken(request, response);

		return true;
	}

	public void checkLoginToken(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String email = null;
		Cookie access = WebUtils.getCookie(request, "accessToken");
		Cookie refresh = WebUtils.getCookie(request, "refreshToken");

		if(access != null && refresh != null) {
			String accessToken = access.getValue();
			String refreshToken = refresh.getValue();
			try {
				Claims claims = tokenManager.getTokenClaims(accessToken);
				email = claims.get("email").toString();
			} catch (ExpiredJwtException e){
				String newAccessToken = null;

				if(tokenManager.validateRefreshToken(refreshToken, request, response))
					newAccessToken = tokenManager.reissueToken(refreshToken);

				if (newAccessToken != null) {
					accessToken = newAccessToken;
					CookieUtils.createSessionCookie(response, "accessToken", accessToken);
				}

				Claims tokenClaims = tokenManager.getTokenClaims(accessToken);
				email = tokenClaims.get("email").toString();

			}catch (Exception e) {
				throw new AuthenticationException(ErrorCode.NOT_VALID_TOKEN);
			}
			request.setAttribute("email", email);
		}
	}
}
