package com.maratang.jamjam.global.util;

import org.springframework.util.StringUtils;

import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;
import com.maratang.jamjam.global.auth.jwt.constant.GrantType;

public class AuthorizationHeaderUtils {
	public static void validateAuthorization(String authorizationHeader) {
	    if (authorizationHeader == null) {
            throw new AuthenticationException(ErrorCode.ACCESS_TOKEN_NOT_FOUND);
        }

		// 1. authorizationHeader 필수 체크
		if (!StringUtils.hasText(authorizationHeader)) {
			throw new AuthenticationException(ErrorCode.NOT_EXISTS_AUTHORIZATION);
		}

		// 2. authorizationHeader bearer 체크
		String[] authorizations = authorizationHeader.split(" ");
		if (authorizations.length < 2 || (!GrantType.BEARER.getType().equals(authorizations[0]))) {
			throw new AuthenticationException(ErrorCode.NOT_VALID_BEARER_GRANT_TYPE);
		}
	}
}
