package com.maratang.jamjam.domain.login.logout.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.login.logout.service.LogoutService;
import com.maratang.jamjam.global.util.AuthorizationHeaderUtils;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/logout")
@RequiredArgsConstructor
@Slf4j
public class LogoutController {

	private final LogoutService logoutService;

	@PostMapping
	@Operation(summary = "로그아웃", description = "refresh token을 만료시킨다.")
	public ResponseEntity<?> logout(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {

		String authorization = httpServletRequest.getHeader("Authorization");
		AuthorizationHeaderUtils.validateAuthorization(authorization);
		String accessToken = authorization.split(" ")[1];

		logoutService.logout(accessToken);

		Cookie[] cookie = httpServletRequest.getCookies();

		for (int i = 0; i < cookie.length; i++) {
			if (cookie[i].getName().equals("refreshToken")) {
				cookie[i].setMaxAge(0);
				cookie[i].setValue(null);
				cookie[i].setPath("/");
				// cookie[i].setHttpOnly(true);
				// cookie[i].setSecure(true);
				httpServletResponse.addCookie(cookie[i]);
			}
			if (cookie[i].getName().equals("accessToken")) {
				cookie[i].setMaxAge(0);
				cookie[i].setValue(null);
				cookie[i].setPath("/");
				httpServletResponse.addCookie(cookie[i]);
			}
		}

		log.info("LOGOUT SUCCESS");
		return ResponseEntity.status(HttpStatus.OK).build();
	}

}
