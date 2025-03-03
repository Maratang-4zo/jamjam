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
	NULL_POINTER_EXCEPTION(HttpStatus.BAD_REQUEST, "CM004", "ERROR: CM004"),
	SQL_EXCEPTION(HttpStatus.INTERNAL_SERVER_ERROR, "CM005", "ERROR: CM005"),
	HIBERNATE_EXCEPTION(HttpStatus.INTERNAL_SERVER_ERROR, "CM006", "ERROR: CM006"),

	// auth
	UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AT001", "인증 토큰이 올바르지 않습니다."),
	FORBIDDEN(HttpStatus.FORBIDDEN, "AT002", "권한이 없습니다."),
	KAKAO_RESPONSE_ERROR(HttpStatus.UNAUTHORIZED, "AT003", "카카오 통신 오류"),

	// 인증(auth)
	TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AT001", "만료된 토큰입니다."),
	NOT_VALID_TOKEN(HttpStatus.UNAUTHORIZED, "AT002", "해당 토큰은 유효한 토큰이 아닙니다."),
	NOT_EXISTS_AUTHORIZATION(HttpStatus.UNAUTHORIZED, "AT003", "Authorization 헤더가 빈 값입니다."),
	NOT_VALID_BEARER_GRANT_TYPE(HttpStatus.UNAUTHORIZED, "AT004", "Bearer type이 아닙니다."),
	REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "AT005", "해당 refresh token은 존재하지 않습니다."),
	REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AT006", "해당 refresh token은 만료되었습니다."),
	NOT_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, "AT007", "해당 토큰은 access token이 아닙니다."),
	ACCESS_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "AT008", "access token이 존재하지 않습니다."),
	ACCESS_TOKEN_NOT_FOUND_SEND_ERROR(HttpStatus.UNAUTHORIZED,"AT009", "응답이 올바르지 않습니다."),
	// FORBIDDEN_ADMIN(HttpStatus.FORBIDDEN, "AT009", "관리자 ROLE이 아닙니다."),

	// MemberAnalysis
	MEMBERANALYSIS_NOT_FOUND(HttpStatus.NOT_FOUND, "MA001", "사용자의 게임 결과 기록이 없습니다." ),

	// member
	INVALID_MEMBER_TYPE(HttpStatus.BAD_REQUEST, "MB001", "잘못된 회원 타입입니다.(memberType : KAKAO"),
	ALREADY_REGISTERED_MEMBER(HttpStatus.BAD_REQUEST, "MB002", "이미 가입된 회원입니다."),
	MEMBER_NOT_EXISTS(HttpStatus.BAD_REQUEST, "MB003", "존재하지 않는 회원입니다."),

	//GAMERECORD
	GAMERECORD_NOT_FOUND(HttpStatus.NOT_FOUND, "GR001", "게임 기록을 찾을 수 없습니다."),

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
	AU_ACCESS_TOKEN_REFRESH(HttpStatus.UNAUTHORIZED, "AU009", "액세스 토큰 재발급 하였습니다."),

	// room
	ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "RM001", "미팅룸을 찾을 수 없습니다."),
	ROOM_CANNOT_ENTER(HttpStatus.BAD_REQUEST, "RM002", "미팅룸에 참여할 수 없습니다."),
	ROOM_NOT_OPEN_FOUND(HttpStatus.NOT_FOUND, "RM003", "미팅룸이 종료되었습니다."),

	// room ws
	INVALID_ROOM_UUID(HttpStatus.FORBIDDEN, "RM004", "방UUID가 일치하지 않습니다."),

	// middle
	MIDDLE_SOMEONE_EMPTY_LOCATION(HttpStatus.NOT_FOUND, "MI001","위치를 선택안한 사람이 존재합니다."),
	MIDDLE_EVERY_EMPTY_LOCATION(HttpStatus.NOT_FOUND, "MI002","아무도 위치를 선택하지 않았습니다."),
	MIDDLE_NOT_FOUND_STATION_LOCATION(HttpStatus.NOT_FOUND, "MI003","중간 지점 주변 역이 존재하지 않습니다."),
	MIDDLE_NOT_FOUND_PURPOSE_LOCATION(HttpStatus.NOT_FOUND, "MI004","해당하는 방 목적지는 없습니다. 유효 목적지 (스터디룸, 식당, 카페)"),
	MIDDLE_NOT_SET_START_LOCATION(HttpStatus.NOT_FOUND, "MI005","먼저 방의 중심점을 먼저 설정해주세요"),

	// roundRecord
	RR_NOT_FOUND(HttpStatus.NOT_FOUND,"RR001","미팅룸 게임 라운드별 기록을 찾을 수 없습니다."),

	// JSON타입으로 변환
	INVALID_JSON(HttpStatus.NOT_ACCEPTABLE, " CT001", "JSON타입으로 변환할 수 없습니다."),

	// game
	GAME_NOT_FOUND(HttpStatus.NOT_FOUND,"GA001","게임을 찾을 수 없습니다."),
	GAME_ROUND_NOT_FOUND(HttpStatus.NOT_FOUND, "GA002", "게임 라운드를 찾을 수 없습니다."),
	INVALID_GAME_ROUND(HttpStatus.BAD_REQUEST, "GA003", "진행 가능한 게임 라운드가 아닙니다."),

	// gameRecord
	GR_NOT_FOUND(HttpStatus.NOT_FOUND,"GR001","게임 레코드 기록을 찾을 수 없습니다."),

	// localDate format
	LF_FORMAT_NOT_MATCH(HttpStatus.BAD_REQUEST,"LD001","날짜 형식이 올바르지 않습니다. 형식은 yyyy-MM-dd'T'HH:mm:ss 입니다.");


	private final HttpStatus status;
	private final String code;
	private final String message;
}
