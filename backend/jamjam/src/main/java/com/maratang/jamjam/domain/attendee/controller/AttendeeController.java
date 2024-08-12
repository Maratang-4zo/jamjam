package com.maratang.jamjam.domain.attendee.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.attendee.dto.response.AttendeeIsAllHasRes;
import com.maratang.jamjam.domain.attendee.service.AttendeeService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/attendees")
@RequiredArgsConstructor
public class AttendeeController {
	private final AttendeeService attendeeService;

	@PatchMapping
	@Operation(summary = "✨ 참여자 업데이트 하기", description = "해당 방에 참여자의 위치 정보를 업데이트 한다.")
	public ResponseEntity<?> updateAttendee(@RequestBody AttendeeUpdateReq attendeeUpdateReq,
											@RequestAttribute UUID roomUUID, @RequestAttribute UUID attendeeUUID) {

		AttendeeIsAllHasRes attendeeIsAllHasRes = attendeeService.updateAttendee(attendeeUpdateReq, roomUUID, attendeeUUID);

		return ResponseEntity.status(HttpStatus.OK).body(attendeeIsAllHasRes);
	}
}
