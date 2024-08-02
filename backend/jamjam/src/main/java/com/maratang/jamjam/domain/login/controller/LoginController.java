package com.maratang.jamjam.domain.login.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.login.dto.response.LoginRes;
import com.maratang.jamjam.domain.login.service.LoginService;
import com.maratang.jamjam.global.util.AuthorizationHeaderUtils;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/login")
public class LoginController {

	private final LoginService loginService;

	@PostMapping
	@Operation(summary = "로그인", description = "token값을 확인하여 이미 존재하는 유저는 로그인을, 존재하지 않는 유저는 회원가입을 시킨다.")
	public ResponseEntity<?> oauthLogin(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {

		String authorizationHeader = httpServletRequest.getHeader("Authorization");
		AuthorizationHeaderUtils.validateAuthorization(authorizationHeader);
		String accessToken = authorizationHeader.split(" ")[1]; // kakao accessToken

		log.info("kakao "+ accessToken);

		LoginRes loginRes = loginService.oauthLogin(accessToken);

		Cookie cookie = new Cookie("refreshToken", loginRes.getRefreshToken());
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		cookie.setSecure(true);
		cookie.setMaxAge(1800);

		httpServletResponse.addCookie(cookie);
		httpServletResponse.addHeader("accessToken", loginRes.getAccessToken());

		return ResponseEntity.status(HttpStatus.OK).build();

	}
}
