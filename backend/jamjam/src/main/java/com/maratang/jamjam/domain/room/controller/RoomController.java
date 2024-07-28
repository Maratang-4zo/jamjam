package com.maratang.jamjam.domain.room.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.room.service.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

	private final RoomService roomService;

	@PostMapping
	public ResponseEntity<?> createRoom(){
		// 방장이 미팅룸을 만들기 위한 정보를 입력하고 DB에 방을 저장한다.
		return ResponseEntity.status(HttpStatus.CREATED).body(null);
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
