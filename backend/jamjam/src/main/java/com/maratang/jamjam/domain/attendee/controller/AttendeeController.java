package com.maratang.jamjam.domain.attendee.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.attendee.service.AttendeeService;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/attendees")
@RequiredArgsConstructor
public class AttendeeController {
	private final AttendeeService attendeeService;

	@PatchMapping
	@Operation(summary = "✨ 참여자 업데이트 하기", description = "해당 방에 참여자의 위치 정보를 업데이트 한다.")
	public ResponseEntity<?> updateAttendee(@RequestBody AttendeeUpdateReq attendeeUpdateReq, HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		String roomToken = null;

		if (cookies != null) {
			for(Cookie cookie : cookies) {
				if(cookie.getName().equals("roomToken")) {
					roomToken = cookie.getValue();
					break;
				}
			}
		}

		if (roomToken == null) {
			throw new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND);
		}

		attendeeService.updateAttendee(attendeeUpdateReq, roomToken);

		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
}
