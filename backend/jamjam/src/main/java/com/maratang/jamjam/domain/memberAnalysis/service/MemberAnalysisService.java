package com.maratang.jamjam.domain.memberAnalysis.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.game.repository.GameRepository;
import com.maratang.jamjam.domain.member.repository.MemberRepository;
import com.maratang.jamjam.domain.memberAnalysis.dto.response.MemberAnalysisRes;
import com.maratang.jamjam.domain.memberAnalysis.entity.MemberAnalysis;
import com.maratang.jamjam.domain.memberAnalysis.mapper.MemberAnalysisMapper;
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
	private final MemberAnalysisMapper memberAnalysisMapper;

	public List<MemberAnalysisRes> getMemberAnalysis(long memberId) {
		List<MemberAnalysis> list = memberAnalysisRepository.findAllByMemberId(memberId)
			.orElseThrow(()-> new BusinessException(ErrorCode.MEMBERANALYSIS_NOT_FOUND));
		List<MemberAnalysisRes> resList = new ArrayList<>();
		for(MemberAnalysis memberAnalysis : list) {
			int winRate = Math.round(memberAnalysis.getGameWinCount()/memberAnalysis.getGameCount()*100);
			MemberAnalysisRes res = MemberAnalysisRes.builder()
				.gameName(memberAnalysis.getGame().getName())
				.winRate(winRate)
				.build();
			resList.add(res);
		}
		return resList;
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
		}
		if(isWin){
			long wincnt = memberAnalysis.getGameWinCount();
			wincnt++;
			memberAnalysisMapper.updateMemberAnalysis(wincnt, memberAnalysis);
		}
		memberAnalysisRepository.save(memberAnalysis);
	}




}
