package com.maratang.jamjam.domain.room.controller;

import java.util.UUID;

import com.maratang.jamjam.domain.room.dto.response.RoomGetRes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.room.service.RoomService;
import com.maratang.jamjam.global.room.RoomTokenProvider;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenClaims;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenDto;
import com.maratang.jamjam.global.station.SubwayInfo;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {
	private final RoomService roomService;
	private final RoomTokenProvider roomTokenProvider;

	@PostMapping
	@Operation(summary = "✨ 방 만들기", description = "방을 만들며, 방장을 설정하고, 사용자도 만든다.")
	public ResponseEntity<?> createRoom(@RequestBody RoomCreateReq roomCreateReq, HttpServletResponse response) {
		RoomJwtTokenClaims roomJwtTokenClaims = roomService.createRoom(roomCreateReq);

		RoomJwtTokenDto roomJwtTokenDto = roomTokenProvider.createRoomJwtToken(roomJwtTokenClaims);

		Cookie cookie = new Cookie("roomToken", roomJwtTokenDto.getRoomToken());
		cookie.setPath("/");

		response.addCookie(cookie);

		return ResponseEntity.status(HttpStatus.CREATED).body(roomJwtTokenClaims);
	}

	@GetMapping("/{roomUUID}/middle")
	@Operation(summary = "✨ 중심점 찾기", description = "그라함 알고리즘을 사용해서 방의 사용자의 좌표들을 읽어서 중심점을 찾는다")
	public ResponseEntity<?> getMiddleStation(@PathVariable UUID roomUUID){
		SubwayInfo startStation = roomService.getMiddleStation(roomUUID);

		return ResponseEntity.status(HttpStatus.OK).body(startStation);
	}

	@GetMapping("/{roomUUID}")
	@Operation(summary = "🚗 구현 중")
	public ResponseEntity<?> getRoom(@PathVariable UUID roomUUID){
		RoomGetRes roomGetRes = roomService.findRoom(roomUUID);

		return ResponseEntity.status(HttpStatus.OK).body(roomGetRes);
	}

	@PostMapping("/{roomUUID}/join")
	@Operation(summary = "🚗 구현 중")
	public ResponseEntity<?> joinRoom(@PathVariable UUID roomUUID){
		// 미팅룸에서 사용할 닉네임을 입력받아 사용자를 저장한다.
		return ResponseEntity.status(HttpStatus.CREATED).body(null);
	}
}
