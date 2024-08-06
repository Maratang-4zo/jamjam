package com.maratang.jamjam.domain.room.controller;

import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class WsRoomController {
	/*

	private final RoomService roomService;

	// 참여자 방 입장
	@MessageMapping("/enter")
	@Operation(summary = "🚗 구현 중")
	public void enterRoom(@Header("roomUUID") UUID roomUUID, @Header("attendeeUUID") UUID attendeeUUID){
		roomService.enterRoom(roomUUID, attendeeUUID);
	}

	// 참여자가 떠남
	@MessageMapping("/leave")
	@Operation(summary = "🚗 구현 중")
	public void leaveRoom(@Header("roomUUID") UUID roomUUID, @Header("attendeeUUID") UUID attendeeUUID){
		roomService.leaveRoom(roomUUID, attendeeUUID);
	}

	// 방 아예 종료
	@MessageMapping("/close")
	@Operation(summary = "🚗 구현 중")
	public void closeRoom(@Header("roomUUID") UUID roomUUID, @Header("attendeeUUID") UUID attendeeUUID, @Payload RoomCloseReq roomCloseReq){
		roomService.closeRoom(roomUUID, attendeeUUID, roomCloseReq);
	}

	 */
}
