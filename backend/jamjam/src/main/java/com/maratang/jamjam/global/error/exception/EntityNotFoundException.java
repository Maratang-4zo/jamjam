package com.maratang.jamjam.global.error.exception;

import com.maratang.jamjam.global.error.ErrorCode;

public class EntityNotFoundException extends BusinessException {

	public EntityNotFoundException(ErrorCode errorCode) {
		super(errorCode);
	}
}
