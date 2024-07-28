package com.maratang.jamjam.domain.room.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.maratang.jamjam.domain.board.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomEnterReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.service.RoomService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class WsRoomController {

	private final RoomService roomService;

	// 참여자 방 입장
	@MessageMapping("/{roomId}/enter")
	public void enterRoom(@DestinationVariable Long roomId, @Payload RoomEnterReq roomEnterReq){
		roomService.enterRoom(roomId, roomEnterReq);

	}

	// 참여자가 떠남
	@MessageMapping("/{roomId}/leave")
	public void leaveRoom(@DestinationVariable Long roomId){
		roomService.leaveRoom(roomId);
	}

	// 방 아예 종료
	@MessageMapping("/{roomId}/close")
	public void closeRoom(@DestinationVariable Long roomId){
		roomService.closeRoom(roomId);
	}

	// 방 정보 수정
	@MessageMapping("/{roomId}/info")
	public void updateRoom(@DestinationVariable Long roomId, @Payload RoomUpdateReq roomUpdateReq){
		roomService.updateRoom(roomId, roomUpdateReq);
    }

	// 사용자 정보 수정
	@MessageMapping("/{roomId}/my")
	public void updateAttendeeInfo(@DestinationVariable	Long roomId, @Payload AttendeeUpdateReq attendeeUpdateReq){
		roomService.updateAttendeeInfo(roomId, attendeeUpdateReq);
	}
}
