package com.maratang.jamjam.domain.memberAnalysis.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MemberAnalysisRes {
	private String gameName;
	private int winRate;

	public static MemberAnalysisRes of(String gameName, int winRate) {
		return MemberAnalysisRes.builder()
                .gameName(gameName)
                .winRate(winRate)
                .build();
	}
}
