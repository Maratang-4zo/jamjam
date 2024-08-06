package com.maratang.jamjam.domain.login.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.maratang.jamjam.domain.login.dto.response.LoginRes;
import com.maratang.jamjam.domain.login.service.LoginService;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/login")
public class LoginController {

	private final LoginService loginService;
	private final RestTemplate restTemplate;
	@Value("${kakao.client.id}")
	private String clientId;
	@Value("${kakao.client.secret}")
	private String clientSecret;
	@Value("${kakao.redirect.uri}")
	private String redirectUri;

	@GetMapping("/authorize")
	@Operation(summary = "카카오 로그인 요청", description = "redirect uri로 리다이렉트합니다.")
	public void redirectToKakao(@RequestParam("redirectUri") String clientRedirectUri, HttpServletRequest request, HttpServletResponse httpServletResponse) throws IOException {
		String authorizeUrl = "https://kauth.kakao.com/oauth/authorize"
			+ "?response_type=code"
			+ "&client_id=" + clientId
			+ "&redirect_uri=" + redirectUri;

		HttpSession session = request.getSession();
		session.setAttribute("clientRedirectUri", clientRedirectUri);

		httpServletResponse.sendRedirect(authorizeUrl);
	}

	@GetMapping("/oauth/kakao/callback")
	@Operation(summary = "로그인", description = "인가 코드를 사용하여 액세스 토큰을 받아와서 로그인 처리합니다.")
	public void oauthLogin(@RequestParam("code") String code, HttpServletRequest request,
		HttpServletResponse response) throws IOException {

		// 인가 코드로 kakao 액세스 토큰 요청
		String accessToken = getAccessToken(code);

		// 액세스 토큰을 이용해 로그인 처리
		LoginRes loginRes = loginService.oauthLogin(accessToken);

		Cookie cookie = new Cookie("refreshToken", loginRes.getRefreshToken());
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		cookie.setSecure(true);

		Cookie aceessTokencookie = new Cookie("accessToken", loginRes.getAccessToken());
		cookie.setPath("/");

		response.addCookie(cookie);
		response.addCookie(aceessTokencookie);

		HttpSession session = request.getSession();
		String clientRedirectUri = (String) session.getAttribute("clientRedirectUri");

		log.info(clientRedirectUri);
		if (clientRedirectUri.isEmpty()) {
			// clientRedirectUri = "http://localhost:3000/"; // 기본 리디렉션 URL
			clientRedirectUri = "https://jjam.shop/";
		}
		response.sendRedirect(clientRedirectUri);
		// httpServletResponse.sendRedirect("http://70.12.114.94:3000/");
	}

	private String getAccessToken(String code) {
		String tokenUrl = "https://kauth.kakao.com/oauth/token";

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", clientId);
		params.add("redirect_uri", redirectUri);
		params.add("code", code);
		params.add("client_secret", clientSecret);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

		try {
			ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
			if (response.getStatusCode() == HttpStatus.OK) {
				Map<String, Object> responseBody = response.getBody();
				return responseBody.get("access_token").toString();
			} else {
				throw new AuthenticationException(ErrorCode.ACCESS_TOKEN_NOT_FOUND);
			}
		} catch (Exception e) {
			throw new AuthenticationException(ErrorCode.ACCESS_TOKEN_NOT_FOUND);
		}
	}
}
