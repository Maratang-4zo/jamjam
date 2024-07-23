package com.maratang.jamjam.global.error;

import lombok.Builder;
import lombok.Getter;

@Getter
public class ErrorResponse {
	private String code;
	private String message;

	@Builder
	public ErrorResponse(String code, String message) {
		this.code = code;
		this.message = message;
	}

	public static ErrorResponse of(ErrorCode errorCode) {
		return ErrorResponse.builder()
			.code(errorCode.getCode())
			.message(errorCode.getMessage())
			.build();
	}
}
