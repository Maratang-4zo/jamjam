package com.maratang.jamjam.domain.login.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.maratang.jamjam.domain.login.dto.response.LoginRes;
import com.maratang.jamjam.global.jwt.dto.JwtTokenDto;

@Mapper(componentModel = "spring")
public interface LoginMapper {

	LoginMapper INSTANCE = Mappers.getMapper(LoginMapper.class);

	LoginRes jwtTokenDtoToLoginRes(JwtTokenDto jwtTokenDto);

}
