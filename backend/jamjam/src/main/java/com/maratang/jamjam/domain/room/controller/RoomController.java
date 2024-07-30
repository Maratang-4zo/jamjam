package com.maratang.jamjam.domain.room.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.attendee.service.AttendeeService;
import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.service.RoomService;
import com.maratang.jamjam.global.room.RoomTokenProvider;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenCliams;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenDto;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/room")
@RequiredArgsConstructor
public class RoomController {
	private final RoomService roomService;
	private final AttendeeService attendeeService;
	private final RoomTokenProvider roomTokenProvider;

	@PostMapping
	@Operation(summary = "방 만들기", description = "방을 만들며, 방장을 설정하고, 사용자도 만든다.")
	public ResponseEntity<?> createRoom(@RequestBody RoomCreateReq roomCreateReq, HttpServletResponse response) {
		RoomJwtTokenCliams roomJwtTokenCliams = roomService.createRoom(roomCreateReq);

		RoomJwtTokenDto roomJwtTokenDto = roomTokenProvider.createRoomJwtToken(roomJwtTokenCliams);

		Cookie cookie = new Cookie("roomToken", roomJwtTokenDto.getRoomToken());
		cookie.setHttpOnly(true);
		cookie.setPath("/");

		response.addCookie(cookie);

		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@PatchMapping
	@Operation(summary = "방 정보 업데이트 하기", description = "방에 대한 정보를 바꾼다.")
	public ResponseEntity<?> updateRoom(@RequestBody RoomUpdateReq roomUpdateReq) {
		roomService.updateRoom(roomUpdateReq);

		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@GetMapping("/{roomId}")
	public ResponseEntity<?> getRoom(@PathVariable Long roomId){
		// 링크를 클릭했을 때 연결된 활성화 상태의 방이 있는지 확인한다 (채팅방 유효성 검사)
		return ResponseEntity.status(HttpStatus.OK).body(null);
	}

	@PostMapping("/{roomId}/join")
	public ResponseEntity<?> joinRoom(@PathVariable Long roomId){
		// 미팅룸에서 사용할 닉네임을 입력받아 사용자를 저장한다.
		return ResponseEntity.status(HttpStatus.CREATED).body(null);
	}
}
