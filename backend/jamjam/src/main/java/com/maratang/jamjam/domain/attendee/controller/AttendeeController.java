package com.maratang.jamjam.domain.attendee.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeCreateReq;
import com.maratang.jamjam.domain.attendee.service.AttendeeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attendee")
@RequiredArgsConstructor
public class AttendeeController {
	private final AttendeeService attendeeService;

	@PostMapping
	public ResponseEntity<?> createAttendee(@RequestBody AttendeeCreateReq attendeeCreateReq) {
		attendeeService.createAttendee(attendeeCreateReq);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
}
