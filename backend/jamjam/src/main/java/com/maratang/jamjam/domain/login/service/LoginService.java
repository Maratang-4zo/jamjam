package com.maratang.jamjam.domain.login.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.service.MemberService;
import com.maratang.jamjam.global.auth.jwt.dto.JwtTokenDto;
import com.maratang.jamjam.global.auth.jwt.manager.TokenManager;
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
	private final TokenManager tokenManager;

	public JwtTokenDto oauthLogin(String accessToken) {

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
			jwtTokenDto = tokenManager.createJwtToken(oauthMember.getEmail(), oauthMember.getNickname());
			oauthMember.updateRefreshToken(jwtTokenDto);
			log.info("신규회원: "+oauthMember.getNickname() + " " + oauthMember.getEmail());
		} else {// 기존 회원일 경우
			jwtTokenDto = tokenManager.createJwtToken(optionalMember.getEmail(), optionalMember.getNickname());
			optionalMember.updateRefreshToken(jwtTokenDto);
			log.info("기존회원: " + optionalMember.getNickname() + " " + optionalMember.getEmail());
		}

		return jwtTokenDto;

	}

}
