package com.maratang.jamjam.global.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)  // null인 필드는 JSON 응답에 포함되지 않도록 설정
public class ErrorResponse {
	private String code;
	private String message;
	private Map<String, String> errors; // 필드 오류를 담기 위한 선택적 필드

	@Builder
	public ErrorResponse(String code, String message, Map<String, String> errors) {
		this.code = code;
		this.message = message;
		this.errors = errors; // 필요할 때만 설정
	}

	public static ErrorResponse of(ErrorCode errorCode) {
		return ErrorResponse.builder()
				.code(errorCode.getCode())
				.message(errorCode.getMessage())
				.build();
	}

	public static ErrorResponse of(ErrorCode errorCode, Map<String, String> errors) {
		return ErrorResponse.builder()
				.code(errorCode.getCode())
				.message(errorCode.getMessage())
				.errors(errors)  // 필드 오류를 포함할 때만 설정
				.build();
	}
}
