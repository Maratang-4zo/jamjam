package com.maratang.jamjam.domain.room.controller;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.maratang.jamjam.domain.room.service.RoomService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class WsRoomController {

	private final RoomService roomService;

	// 참여자 방 입장
	@MessageMapping("/room.enter")
	@Operation(summary = "✨ 참여자가 방을 입장한다.")
	public void enterRoom(UUID roomUUID, UUID attendeeUUID){
		roomService.enterRoom(roomUUID, attendeeUUID);
	}

	// 참여자가 떠남
	@MessageMapping("/room.leave")
	@Operation(summary = "✨ 참여자가 떠난다.")
	public void leaveRoom(UUID roomUUID, UUID attendeeUUID){
		roomService.leaveRoom(roomUUID, attendeeUUID);
	}

	// 방 아예 종료
	@MessageMapping("/room.close")
	@Operation(summary = "✨ 방장이 방을 종료시킨다.")
	public void closeRoom(UUID roomUUID, UUID attendeeUUID){
		roomService.closeRoom(roomUUID, attendeeUUID);
	}

}
