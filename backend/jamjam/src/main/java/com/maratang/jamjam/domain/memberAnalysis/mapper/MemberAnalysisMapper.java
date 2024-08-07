package com.maratang.jamjam.domain.memberAnalysis.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.memberAnalysis.entity.MemberAnalysis;

@Mapper(componentModel = "spring")
public interface MemberAnalysisMapper {

	MemberAnalysisMapper INSTANCE = Mappers.getMapper(MemberAnalysisMapper.class);

	@Mapping(source = "updateGameWinCount", target = "gameWinCount")
	MemberAnalysis updateMemberAnalysis(long updateGameWinCount, MemberAnalysis memberAnalysis);
}
