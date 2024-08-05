package com.maratang.jamjam.domain.room.controller;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.maratang.jamjam.domain.board.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomCloseReq;
import com.maratang.jamjam.domain.room.dto.request.RoomEnterReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.service.RoomService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class WsRoomController {

	private final RoomService roomService;

	// 참여자 방 입장
	@MessageMapping("/enter")
	@Operation(summary = "🚗 구현 중")
	public void enterRoom(@Header("roomUUID") UUID roomUUID, @Header("attendeeUUID") UUID attendeeUUID, @Payload RoomEnterReq roomEnterReq){
		// roomService.enterRoom(roomId, roomEnterReq);

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

	// 방 정보 수정
	@MessageMapping("/info")
	@Operation(summary = "🚗 구현 중")
	public void updateRoom(@Header("roomUUID") UUID roomUUID, @Header("attendeeUUID") UUID attendeeUUID, @Payload RoomUpdateReq roomUpdateReq){
		roomService.updateRoom(roomUUID, roomUpdateReq);
    }

	// 사용자 정보 수정
	@MessageMapping("/my")
	@Operation(summary = "🚗 구현 중")
	public void updateAttendeeInfo(@Header("roomUUID") UUID roomUUID, @Header("attendeeUUID") UUID attendeeUUID, @Payload AttendeeUpdateReq attendeeUpdateReq){
		roomService.updateAttendeeInfo(roomUUID, attendeeUpdateReq);
	}
}
