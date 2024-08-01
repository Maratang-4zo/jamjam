package com.maratang.jamjam.global.error.exception;

import com.maratang.jamjam.global.error.ErrorCode;

public class AuthenticationException extends BusinessException {

	public AuthenticationException(ErrorCode errorCode) {
		super(errorCode);
	}
}
