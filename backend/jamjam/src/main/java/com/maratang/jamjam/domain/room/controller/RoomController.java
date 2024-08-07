package com.maratang.jamjam.domain.room.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeCreateReq;
import com.maratang.jamjam.domain.attendee.service.AttendeeService;
import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomMoveReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.dto.response.RoomGetRes;
import com.maratang.jamjam.domain.room.dto.response.RoomJoinRes;
import com.maratang.jamjam.domain.room.dto.response.RoomMiddleRes;
import com.maratang.jamjam.domain.room.service.RoomService;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.room.RoomTokenProvider;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenClaims;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenDto;
import com.maratang.jamjam.global.station.SubwayInfo;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {
	private final RoomService roomService;
	private final RoomTokenProvider roomTokenProvider;
	private final AttendeeService attendeeService;

	@PostMapping
	@Operation(summary = "✨ 방 만들기", description = "방을 만들며, 방장을 설정하고, cookie(roomToken)을 준다, 해당 방에 참여자를 추가한다.")
	public ResponseEntity<?> createRoom(@RequestBody RoomCreateReq roomCreateReq, HttpServletResponse response) {
		RoomJwtTokenClaims roomJwtTokenClaims = roomService.createRoom(roomCreateReq);

		RoomJwtTokenDto roomJwtTokenDto = roomTokenProvider.createRoomJwtToken(roomJwtTokenClaims);

		Cookie cookie = new Cookie("roomToken", roomJwtTokenDto.getRoomToken());
		cookie.setPath("/");

		response.addCookie(cookie);

		return ResponseEntity.status(HttpStatus.CREATED).body(roomJwtTokenClaims);
	}

	@PatchMapping("/{roomUUID}")
	@Operation(summary = "✨ 방 정보 변경하기", description = "방에 대한 정보를 변경한다.")
	public ResponseEntity<?> updateRoom(@PathVariable UUID roomUUID, @RequestBody RoomUpdateReq roomUpdateReq) {
		roomService.updateRoom(roomUUID, roomUpdateReq);

		return ResponseEntity.status(HttpStatus.OK).body(null);
	}

	@PatchMapping("/{roomUUID}/move")
	@Operation(summary = "✨ 방 중심 위치 수정", description = "방 중심 위치 수정이 게임끝나고 모임위치 결정하고 나면 보낸다.")
	public ResponseEntity<?> moveRoom(@PathVariable UUID roomUUID, @RequestBody RoomMoveReq roomMoveReq) {
		roomService.moveRoom(roomUUID, roomMoveReq);

		return ResponseEntity.status(HttpStatus.OK).body(null);
	}

	@GetMapping("/{roomUUID}/middle")
	@Operation(summary = "✨ 중심점 찾기", description = "그라함 알고리즘을 사용해서 방의 사용자의 좌표들을 읽어서 중심점을 찾는다")
	public ResponseEntity<?> getMiddleStation(@PathVariable UUID roomUUID){
		RoomMiddleRes roomMiddleRes = roomService.getMiddleStation(roomUUID);

		return ResponseEntity.status(HttpStatus.OK).body(roomMiddleRes);
	}

	@GetMapping("/{roomUUID}/around")
	@Operation(summary = "✨ 중심점 주변역 찾기", description = "중심점 주변 역을 찾는다.")
	public ResponseEntity<?> getAroundStation(@PathVariable UUID roomUUID){
		List<SubwayInfo> aroundStation = roomService.getAroundStation(roomUUID);

		return ResponseEntity.status(HttpStatus.OK).body(aroundStation);
	}

	@GetMapping("/{roomUUID}")
	@Operation(summary = "✨ 방 존재 유무 확인", description = "방이 존재하지 않거나, 중단, 종료 된 방은 404 에러 처리한다.")
	public ResponseEntity<?> getRoom(@PathVariable UUID roomUUID, HttpServletRequest request){
		Cookie[] cookies = request.getCookies();
		String roomToken = null;

		if (cookies != null) {
			for(Cookie cookie : cookies) {
				if(cookie.getName().equals("roomToken")) {
					roomToken = cookie.getValue();
					break;
				}
			}
		}

		if (roomToken == null) {
			throw new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND);
		}

		RoomGetRes roomGetRes = roomService.findRoom(roomUUID, roomToken);

		return ResponseEntity.status(HttpStatus.OK).body(roomGetRes);
	}

	@PostMapping("/{roomUUID}/join")
	@Operation(summary = "✨ 참여자가 방에 입장한다.", description = "사용자가 방에 입장한다. cookie(roomToken)을 준다, 해당 방에 참여자를 추가한다.")
	public ResponseEntity<?> joinRoom(@PathVariable UUID roomUUID, @RequestBody AttendeeCreateReq attendeeCreateReq, HttpServletResponse response){
		RoomJoinRes roomJoinRes = attendeeService.createAttendee(roomUUID, attendeeCreateReq);

		RoomJwtTokenClaims roomJwtTokenClaims = RoomJwtTokenClaims.builder()
				.roomUUID(roomJoinRes.getRoomUUID())
				.attendeeUUID(roomJoinRes.getAttendeeUUID())
				.build();

		RoomJwtTokenDto roomJwtTokenDto = roomTokenProvider.createRoomJwtToken(roomJwtTokenClaims);

		Cookie cookie = new Cookie("roomToken", roomJwtTokenDto.getRoomToken());
		cookie.setPath("/");

		response.addCookie(cookie);

		return ResponseEntity.status(HttpStatus.CREATED).body(roomJoinRes);
	}
}
