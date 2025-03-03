package com.maratang.jamjam.domain.login.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.login.dto.response.LoginRes;
import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.service.MemberService;
import com.maratang.jamjam.global.auth.jwt.dto.JwtTokenDto;
import com.maratang.jamjam.global.auth.jwt.manager.LoginTokenManager;
import com.maratang.jamjam.global.auth.oauth.kakao.service.SocialLoginApiServiceFactory;
import com.maratang.jamjam.global.auth.oauth.model.OAuthAttributes;
import com.maratang.jamjam.global.auth.oauth.service.SocialLoginApiService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class LoginService {

	private final MemberService memberService;
	private final LoginTokenManager loginTokenManager;

	public LoginRes oauthLogin(String accessToken, String refreshToken) {

		SocialLoginApiService socialLoginApiService = SocialLoginApiServiceFactory.getSocialLoginApiService();

		log.info(socialLoginApiService.toString());

		OAuthAttributes userInfo = socialLoginApiService.getUserInfo(accessToken);

		log.info("userInfo : {}", userInfo);
		log.info("useremail : {}", userInfo.getEmail());

		JwtTokenDto jwtTokenDto;
		Member optionalMember = memberService.findMemberByEmail(userInfo.getEmail());
		if (optionalMember == null) { // 신규 회원가입
			Member oauthMember = userInfo.toMemberEntity();
			oauthMember = memberService.registerMember(oauthMember);
			jwtTokenDto = loginTokenManager.createJwtToken(oauthMember.getEmail(), oauthMember.getNickname());
			oauthMember.updateRefreshToken(jwtTokenDto);
			oauthMember.updateTokens(accessToken, refreshToken);
			log.info("신규회원: "+oauthMember.getNickname() + " " + oauthMember.getEmail());
		} else {// 기존 회원일 경우
			jwtTokenDto = loginTokenManager.createJwtToken(optionalMember.getEmail(), optionalMember.getNickname());
			optionalMember.updateRefreshToken(jwtTokenDto);
			optionalMember.updateTokens(accessToken, refreshToken);
			log.info("기존회원: " + optionalMember.getNickname() + " " + optionalMember.getEmail());
		}

		LoginRes loginRes = LoginRes.of(jwtTokenDto);

		return loginRes;

	}

}
