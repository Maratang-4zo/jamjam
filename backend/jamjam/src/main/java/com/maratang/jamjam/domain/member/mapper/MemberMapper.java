package com.maratang.jamjam.domain.member.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.member.dto.request.MemberInfoRequestDto;
import com.maratang.jamjam.domain.member.dto.response.MemberInfoResponseDto;
import com.maratang.jamjam.domain.member.entity.Member;

@Mapper(componentModel = "spring")
public interface MemberMapper {

	MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);

	MemberInfoResponseDto memberToMemberRes(Member member);

	Member memberInfoRequestDtoToMember(MemberInfoRequestDto memberInfoRequestDto);

}
