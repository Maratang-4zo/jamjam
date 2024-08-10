package com.maratang.jamjam.global.auth.jwt.constant;

public enum TokenType {

	ACCESS, REFRESH;

	public static boolean isAccess(String tokenType) {
		return TokenType.ACCESS.name().equals(tokenType);
	}
}
