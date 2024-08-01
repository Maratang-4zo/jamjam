package com.maratang.jamjam.domain.member.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.member.dto.request.MemberInfoRequestDto;
import com.maratang.jamjam.domain.member.dto.response.MemberInfoResponseDto;
import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.mapper.MemberMapper;
import com.maratang.jamjam.domain.member.service.MemberService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

	private final MemberService memberService;
	private final MemberMapper memberMapper;

	@GetMapping("/info")
	@Operation(summary = "유저 정보 보기", description = "유저의 정보를 출력한다.")
	public ResponseEntity<?> getMemberInfo(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {

		String memberEmail = String.valueOf(httpServletRequest.getAttribute("email"));
		Member member = memberService.findMemberByEmail(memberEmail);
		MemberInfoResponseDto memberInfoResponseDto = memberMapper.INSTANCE.memberToMemberRes(member);

		if(httpServletRequest.getAttribute("accessToken") != null) {
			String accessToken = (String) httpServletRequest.getAttribute("accessToken");
			httpServletResponse.addHeader("accessToken", accessToken);
		}

		return ResponseEntity.status(HttpStatus.OK).body(memberInfoResponseDto);
	}

	@PatchMapping("/info")
	@Operation(summary = "유저 정보 수정", description = "원하는 닉네임으로 수정할 수 있다.")
	public ResponseEntity<MemberInfoResponseDto> updateMemberInfo(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @RequestBody String nickname) {

		String memberEmail = String.valueOf(httpServletRequest.getAttribute("email"));
		MemberInfoRequestDto memberInfoRequestDto = MemberInfoRequestDto.builder()
			.email(memberEmail)
			.nickname(nickname)
			.build();
		Member member = memberMapper.INSTANCE.memberInfoRequestDtoToMember(memberInfoRequestDto);
		Member updatemember = memberService.updateMember(member);
		MemberInfoResponseDto memberInfoResponseDto = memberMapper.INSTANCE.memberToMemberRes(updatemember);

		if(httpServletRequest.getAttribute("accessToken") != null) {
			String accessToken = (String) httpServletRequest.getAttribute("accessToken");
			httpServletResponse.addHeader("accessToken", accessToken);
		}

		return ResponseEntity.ok(memberInfoResponseDto);
	}

	/*
	@GetMapping("/game-history")
	@Operation(summary = "게임 히스토리 보기", description = "회원의 게임 기록을 본다.")
	public ResponseEntity<List<>>
	 */

	/*
	@GetMapping("/room-history")
	@Operation(summary = "모임 히스토리 보기", description = "회원의 모임 기록을 본다.")
	public ResponseEntity<List<>>
	 */


}

