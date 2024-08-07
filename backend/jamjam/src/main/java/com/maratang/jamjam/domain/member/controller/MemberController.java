package com.maratang.jamjam.domain.member.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.member.dto.request.MemberPatchReq;
import com.maratang.jamjam.domain.member.dto.request.MemberReq;
import com.maratang.jamjam.domain.member.dto.response.MemberRes;
import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.mapper.MemberMapper;
import com.maratang.jamjam.domain.member.service.MemberService;
import com.maratang.jamjam.domain.memberAnalysis.dto.response.MemberAnalysisRes;
import com.maratang.jamjam.domain.memberAnalysis.service.MemberAnalysisService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Slf4j
public class MemberController {

	private final MemberService memberService;
	private final MemberMapper memberMapper;
	private final MemberAnalysisService memberAnalysisService;

	@GetMapping("/info")
	@Operation(summary = "유저 정보 보기", description = "유저의 정보를 출력한다.")
	public ResponseEntity<?> getMemberInfo(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {

		String memberEmail = String.valueOf(httpServletRequest.getAttribute("email"));
		log.info("정보임:"+memberEmail);
		Member member = memberService.findMemberByEmail(memberEmail);
		MemberRes memberRes = memberMapper.INSTANCE.memberToMemberRes(member);

		log.info("정보내놔: ");
		if(httpServletRequest.getAttribute("accessToken") != null) {
			String accessToken = (String) httpServletRequest.getAttribute("accessToken");
			httpServletResponse.addHeader("accessToken", accessToken);
		}
		log.info("정보임:"+memberRes.getEmail());

		return ResponseEntity.status(HttpStatus.OK).body(memberRes);
	}

	@PatchMapping("/info")
	@Operation(summary = "유저 정보 수정", description = "원하는 닉네임으로 수정할 수 있다.")
	public ResponseEntity<?> updateMemberInfo(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @RequestBody MemberPatchReq memberPatchReq) {

		String memberEmail = String.valueOf(httpServletRequest.getAttribute("email"));
		MemberReq memberReq = MemberReq.builder()
			.email(memberEmail)
			.nickname(memberPatchReq.getNickname())
			.build();
		Member member = memberMapper.INSTANCE.memberReqToMember(memberReq);
		Member updateMember = memberService.updateMember(member);
		MemberRes memberRes = memberMapper.INSTANCE.memberToMemberRes(updateMember);

		if(httpServletRequest.getAttribute("accessToken") != null) {
			String accessToken = (String) httpServletRequest.getAttribute("accessToken");
			httpServletResponse.addHeader("accessToken", accessToken);
		}

		return ResponseEntity.status(HttpStatus.OK).body(memberRes);
	}


	@GetMapping("/game-history")
	@Operation(summary = "게임 히스토리 보기", description = "회원의 게임 기록을 본다.")
	public ResponseEntity<List<MemberAnalysisRes>> getMemberAnalysis(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
		String memberEmail = String.valueOf(httpServletRequest.getAttribute("email"));
		Member member = memberService.findMemberByEmail(memberEmail);
		return ResponseEntity.ok().body(memberAnalysisService.getMemberAnalysis(member.getMemberId()));
	}

	/*
	@GetMapping("/room-history")
	@Operation(summary = "모임 히스토리 보기", description = "회원의 모임 기록을 본다.")
	public ResponseEntity<List<>>
	 */


}

