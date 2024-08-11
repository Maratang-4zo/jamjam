package com.maratang.jamjam.domain.member.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.member.dto.request.MemberPatchReq;
import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.repository.MemberRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class MemberService {

	private final MemberRepository memberRepository;

	@Transactional
	public Member registerMember(Member member) {
		validateDuplicateMember(member);
		return memberRepository.save(member);
	}

	private void validateDuplicateMember(Member member) {

		Optional<Member> optionalMember = memberRepository.findByEmail(member.getEmail());
		if (optionalMember.isPresent()) {
			throw new BusinessException(ErrorCode.ALREADY_REGISTERED_MEMBER);
		}
	}

	public Member findMemberByEmail(String email) {
		Optional<Member> optionalMember = memberRepository.findByEmail(email);
		if (optionalMember.isPresent()) {
			return optionalMember.get();
		}
		return null;
	}

	public Member findMemberByRefreshToken(String refreshToken) {
		Member member = memberRepository.findByRefreshToken(refreshToken)
			.orElseThrow(() -> new AuthenticationException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));
		LocalDateTime tokenExpirationTime = member.getTokenExpirationTime();
		if (tokenExpirationTime.isBefore(LocalDateTime.now())) {
			throw new AuthenticationException(ErrorCode.REFRESH_TOKEN_EXPIRED);
		}
		return member;
	}

	@Transactional
	public Member updateMember(Member member, MemberPatchReq memberPatchReq) {
		log.info("여기 멤버서비스 수정중"+memberPatchReq.getNickname());
		member.updateNickname(memberPatchReq.getNickname());
		return memberRepository.save(member);
	}

	// @Transactional(readOnly = true)
	// public Member findMemberByMemberId(Long memberId) {
	// 	return memberRepository.findById(memberId)
	// 		.orElseThrow(() -> new EntityNotFoundException(ErrorCode.MEMBER_NOT_EXISTS));
	//
	// }


}
