package com.maratang.jamjam.global.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtils {

	private CookieUtils(){}

	public static void createCookie(HttpServletResponse response, String name, String value, int maxAge, boolean httpOnly, String path) {
		Cookie cookie = new Cookie(name, value);
		if (maxAge != -1) { // Set max age if it's not -1
			cookie.setMaxAge(maxAge);
		}
		cookie.setPath(path);
		cookie.setHttpOnly(httpOnly);
		cookie.setSecure(httpOnly);
		response.addCookie(cookie);
	}

	public static void removeCookie(HttpServletRequest request, HttpServletResponse response, String cookieName) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(cookieName)) {
					cookie.setMaxAge(0);
					response.addCookie(cookie);
					return;
				}
			}
		}
	}

	public static void createSecureCookie(HttpServletResponse response, String name, String value, int maxAge) {
		createCookie(response, name, value, maxAge, true, "/");
	}
	public static void createSecureSessionCookie(HttpServletResponse response, String name, String value) {
		createCookie(response, name, value, -1, true, "/");
	}

	public static void createCookie(HttpServletResponse response, String name, String value, int maxAge) {
		createCookie(response, name, value, maxAge, false, "/");
	}
	public static void createSessionCookie(HttpServletResponse response, String name, String value) {
		createCookie(response, name, value, -1, false, "/");
	}
}
