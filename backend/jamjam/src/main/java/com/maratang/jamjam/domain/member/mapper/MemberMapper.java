package com.maratang.jamjam.domain.member.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.member.dto.request.MemberReq;
import com.maratang.jamjam.domain.member.dto.response.MemberRes;
import com.maratang.jamjam.domain.member.entity.Member;

@Mapper(componentModel = "spring")
public interface MemberMapper {

	MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);

	MemberRes memberToMemberRes(Member member);

	Member memberReqToMember(MemberReq memberReq);

	@Mapping(source = "updateNickname", target = "nickname")
	Member updateMember(String updateNickname, Member member);


}
