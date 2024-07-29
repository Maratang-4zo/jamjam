package com.maratang.jamjam.global.error;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
	// common
	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "CM000", "요청 처리 중 오류가 발생했습니다."),
	BAD_REQUEST(HttpStatus.BAD_REQUEST, "CM001", "잘못된 요청입니다."),
	INVALID_PARAMETER(HttpStatus.BAD_REQUEST, "CM002", "잘못된 요청 데이터 입니다."),
	UNSUPPORTED_MEDIA_TYPE(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "CM003", "데이터 타입이 올바르지 않습니다"),

	// auth
	UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AT001", "인증 토큰이 올바르지 않습니다."),
	FORBIDDEN(HttpStatus.FORBIDDEN, "AT002", "권한이 없습니다."),

	// oauth2
	OAUTH2_PROVIDER_NOT_FOUND(HttpStatus.BAD_REQUEST, "OA001", "해당 Provider는 지원되지 않습니다."),
	OAUTH2_AUTHENTICATION_FAILED(HttpStatus.BAD_REQUEST, "OA002", "OAUTH2 사용자 정보를 가져오는 중 오류가 발생했습니다."),

	// user
	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "US001", "유저를 찾을 수 없습니다."),
	USER_EMAIL_DUPLICATE(HttpStatus.CONFLICT, "US002", "사용중인 이메일 입니다."),
	USER_NICKNAME_DUPLICATE(HttpStatus.CONFLICT, "US003", "사용중인 닉네임 입니다."),
	USER_CANNOT_DELETE(HttpStatus.NOT_ACCEPTABLE, "US004", "유저를 삭제할 수 없습니다."),
	ADMIN_CANNOT_DELETE(HttpStatus.NOT_ACCEPTABLE, "US005", "관리자는 삭제할 수 없습니다."),

	// openvidu
	OV_SERVER_ERROR(HttpStatus.BAD_REQUEST, "OV000", "OV 처리 중 오류가 발생했습니다."),
	OV_CANNOT_CREATE_SESSION(HttpStatus.BAD_REQUEST, "OV001", "OV 세션을 생성하지 못했습니다."),
	OV_CANNOT_CREATE_CONNECTION(HttpStatus.BAD_REQUEST, "OV002", "OV 커넥션을 생성하지 못했습니다."),
	OV_SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "OV003", "OV 세션을 찾을 수 없습니다."),

	// attendee
	ATTENDEE_NOT_FOUND(HttpStatus.NOT_FOUND, "AT001", "미팅 참여자를 찾을 수 없습니다."),

	// 인증 && 인가
	AU_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AU001", "토큰이 만료되었습니다."),
	AU_NOT_VALID_TOKEN(HttpStatus.UNAUTHORIZED, "AU002", "해당 토큰은 유효한 토큰이 아닙니다."),
	AU_NOT_EXISTS_AUTHORIZATION(HttpStatus.UNAUTHORIZED, "AU003", "Authorization Header가 빈값입니다."),
	AU_NOT_VALID_BEARER_GRANT_TYPE(HttpStatus.UNAUTHORIZED, "AU004", "인증 타입이 Bearer 타입이 아닙니다."),
	AU_REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "AU005", "해당 refresh token은 존재하지 않습니다."),
	AU_REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AU006", "해당 refresh token은 만료됐습니다."),
	AU_NOT_ACCESS_TOKEN_TYPE(HttpStatus.UNAUTHORIZED, "AU007", "해당 토큰은 ACCESS TOKEN이 아닙니다."),
	AU_FORBIDDEN_ADMIN(HttpStatus.FORBIDDEN, "AU008", "관리자 Role이 아닙니다."),
	AU_ACCESS_TOKEN_REFRESH(HttpStatus.UNAUTHORIZED, "AU009", "액세스 토큰 재발급 하였습니다.");

	private final HttpStatus status;
	private final String code;
	private final String message;
}
