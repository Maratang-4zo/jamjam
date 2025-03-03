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
import com.maratang.jamjam.domain.member.dto.response.MemberRes;
import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.service.MemberService;
import com.maratang.jamjam.domain.memberAnalysis.dto.response.MemberAnalysisRes;
import com.maratang.jamjam.domain.memberAnalysis.service.MemberAnalysisService;
import com.maratang.jamjam.domain.room.dto.response.RoomHistoryRes;
import com.maratang.jamjam.domain.room.service.RoomHistoryService;

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
	private final MemberAnalysisService memberAnalysisService;
	private final RoomHistoryService roomHistoryService;

	@GetMapping("/info")
	@Operation(summary = "유저 정보 보기", description = "유저의 정보를 출력한다.")
	public ResponseEntity<?> getMemberInfo(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {

		String memberEmail = String.valueOf(httpServletRequest.getAttribute("email"));
		log.info("정보임:"+memberEmail);
		Member member = memberService.findMemberByEmail(memberEmail);
		log.info("있니? "+member.getEmail());
		MemberRes memberRes = MemberRes.of(member);
        //
		// log.info("정보내놔: ");
		// if(httpServletRequest.getAttribute("accessToken") != null) {
		// 	String accessToken = (String) httpServletRequest.getAttribute("accessToken");
		// 	httpServletResponse.addHeader("accessToken", accessToken);
		// }
		log.info("정보임:"+memberRes.getEmail());

		return ResponseEntity.status(HttpStatus.OK).body(memberRes);
	}

	// @PatchMapping("/info")
	// @Operation(summary = "유저 정보 수정", description = "원하는 닉네임으로 수정할 수 있다.")
	// public ResponseEntity<?> updateMemberInfo(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @RequestBody MemberPatchReq memberPatchReq) {
	//
	// 	String memberEmail = String.valueOf(httpServletRequest.getAttribute("email"));
	// 	log.info("업데이트 확인중");
	// 	Member member = memberService.findMemberByEmail(memberEmail);
	// 	Member updateMember = memberService.updateMember(member, memberPatchReq);
	// 	MemberRes memberRes = memberMapper.INSTANCE.memberToMemberRes(updateMember);
	// 	log.info("업데이트 확인중22 : "+memberRes.getNickname());
	//
	// 	return ResponseEntity.status(HttpStatus.OK).body(memberRes);
	// }

	@PatchMapping("/info")
	public ResponseEntity<?> updateMemberInfo(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @RequestBody MemberPatchReq memberPatchReq) {
		try {
			log.info("일단 들어옴");
			String memberEmail = String.valueOf(httpServletRequest.getAttribute("email"));
			log.info("Updating member info for email: " + memberEmail);
			log.info("Received patch request: " + memberPatchReq);

			Member member = memberService.findMemberByEmail(memberEmail);
			log.info("Found member: " + member);

			Member updateMember = memberService.updateMember(member, memberPatchReq);
			log.info("Updated member: " + updateMember);

			MemberRes memberRes = MemberRes.of(member);
			log.info("Mapped to MemberRes: " + memberRes);

			return ResponseEntity.status(HttpStatus.OK).body(memberRes);
		} catch (Exception e) {
			log.error("Error updating member info", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
		}
	}

	@GetMapping("/game-history")
	@Operation(summary = "게임 히스토리 보기", description = "회원의 게임 기록을 본다.")
	public ResponseEntity<List<MemberAnalysisRes>> getMemberAnalysis(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
		String memberEmail = String.valueOf(httpServletRequest.getAttribute("email"));
		Member member = memberService.findMemberByEmail(memberEmail);
		List<MemberAnalysisRes> list = memberAnalysisService.getMemberAnalysis(member.getMemberId());
		return ResponseEntity.ok().body(list);
	}


	@GetMapping("/room-history")
	@Operation(summary = "모임 히스토리 보기", description = "회원의 모임 기록을 본다.")
	public ResponseEntity<List<RoomHistoryRes>> getMemberRoomHistory(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
		String memberEmail = String.valueOf(httpServletRequest.getAttribute("email"));
		Member member = memberService.findMemberByEmail(memberEmail);
		List<RoomHistoryRes> list = roomHistoryService.getRoomHistory(member.getMemberId());
		return ResponseEntity.ok().body(list);
	}



}

