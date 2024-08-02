package com.maratang.jamjam.domain.room.controller;

import java.util.UUID;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.maratang.jamjam.domain.board.dto.request.AttendeeUpdateReq;
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
	@MessageMapping("/{roomId}/enter")
	@Operation(summary = "🚗 구현 중")
	public void enterRoom(@DestinationVariable UUID roomUUID, @Payload RoomEnterReq roomEnterReq){
		roomService.enterRoom(roomUUID, roomEnterReq);

	}

	// 참여자가 떠남
	@MessageMapping("/{roomId}/leave")
	@Operation(summary = "🚗 구현 중")
	public void leaveRoom(@DestinationVariable UUID roomUUID){
		roomService.leaveRoom(roomUUID);
	}

	// 방 아예 종료
	@MessageMapping("/{roomId}/close")
	@Operation(summary = "🚗 구현 중")
	public void closeRoom(@DestinationVariable UUID roomUUID){
		roomService.closeRoom(roomUUID);
	}

	// 방 정보 수정
	@MessageMapping("/{roomId}/info")
	@Operation(summary = "🚗 구현 중")
	public void updateRoom(@DestinationVariable UUID roomUUID, @Payload RoomUpdateReq roomUpdateReq){
		roomService.updateRoom(roomUUID, roomUpdateReq);
    }

	// 사용자 정보 수정
	@MessageMapping("/{roomId}/my")
	public void updateAttendeeInfo(@DestinationVariable UUID roomUUID, @Payload AttendeeUpdateReq attendeeUpdateReq){
		roomService.updateAttendeeInfo(roomUUID, attendeeUpdateReq);
	}
}
