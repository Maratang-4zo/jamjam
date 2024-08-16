package com.maratang.jamjam.domain.memberAnalysis.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.game.repository.GameRepository;
import com.maratang.jamjam.domain.member.repository.MemberRepository;
import com.maratang.jamjam.domain.memberAnalysis.dto.response.MemberAnalysisRes;
import com.maratang.jamjam.domain.memberAnalysis.entity.MemberAnalysis;
import com.maratang.jamjam.domain.memberAnalysis.repository.MemberAnalysisRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberAnalysisService {

	private final MemberRepository memberRepository;
	private final MemberAnalysisRepository memberAnalysisRepository;
	private final GameRepository gameRepository;

	public List<MemberAnalysisRes> getMemberAnalysis(long memberId) {
		List<MemberAnalysis> list = memberAnalysisRepository.findAllByMemberId(memberId)
			.orElseThrow(()-> new BusinessException(ErrorCode.MEMBERANALYSIS_NOT_FOUND));

		return list.stream()
			.map(ma -> {
				int winRate = Math.round((float)(ma.getGameWinCount() * 100) /ma.getGameCount());
				return MemberAnalysisRes.of(ma.getGame().getName(), winRate);
			})
			.toList();

	}

	@Transactional
	public void updateGameCount(long memberId, long gameId, boolean isWin){
		MemberAnalysis memberAnalysis = memberAnalysisRepository.findByMemberIdAndGameId(memberId, gameId)
			.orElseThrow(()-> new BusinessException(ErrorCode.MEMBERANALYSIS_NOT_FOUND));
		if(memberAnalysis==null){
			MemberAnalysis createMemberAnalysis = MemberAnalysis.builder()
				.game(gameRepository.findById(gameId).get())
				.gameCount(1)
				.gameWinCount(0)
				.member(memberRepository.findById(memberId).get())
				.build();
			memberAnalysis = memberAnalysisRepository.save(createMemberAnalysis);
		}else{
			long cnt = memberAnalysis.getGameCount();
			cnt++;
			memberAnalysis.updateGameCount(cnt);
		}

		if(isWin){
			long wincnt = memberAnalysis.getGameWinCount();
			wincnt++;
			memberAnalysis.updateGameWinCount(wincnt);
		}
		memberAnalysisRepository.save(memberAnalysis);
	}




}
