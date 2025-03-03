package com.maratang.jamjam.domain.room.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
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
import com.maratang.jamjam.domain.room.dto.response.RoomMoveRes;
import com.maratang.jamjam.domain.room.dto.response.RoomRes;
import com.maratang.jamjam.domain.room.dto.response.SubwayLocalInfo;
import com.maratang.jamjam.domain.room.service.RoomMapService;
import com.maratang.jamjam.domain.room.service.RoomService;
import com.maratang.jamjam.global.auth.room.RoomTokenManager;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenClaims;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenDto;
import com.maratang.jamjam.global.map.station.SubwayInfo;
import com.maratang.jamjam.global.util.CookieUtils;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {
	private final RoomService roomService;
	private final RoomTokenManager roomTokenManager;
	private final AttendeeService attendeeService;
	private final RoomMapService roomMapService;

	@GetMapping("/{roomUUID}")
	@Operation(summary = "✨ 방 정보 받기", description = "방에 대한 정보를 받습니다.")
	public ResponseEntity<?> getRoom(@PathVariable UUID roomUUID, @RequestAttribute UUID attendeeUUID){
		RoomGetRes roomGetRes = roomService.findRoom(roomUUID, attendeeUUID);

		return ResponseEntity.status(HttpStatus.OK).body(roomGetRes);
	}

	@GetMapping("/{roomUUID}/exists")
	@Operation(summary = "✨ 방 존재 유무 확인", description = "방이 존재하지 않거나, 중단, 종료 된 방은 404 에러 처리한다.")
	public ResponseEntity<?> isRoomExist(@PathVariable UUID roomUUID, HttpServletRequest request){
		RoomRes roomGetRes = roomService.isRoomExist(roomUUID, request);
		return ResponseEntity.status(HttpStatus.OK).body(roomGetRes);
	}

	@PostMapping
	@Operation(summary = "✨ 방 만들기", description = "방을 만들며, 방장을 설정하고, cookie(roomToken)을 준다, 해당 방에 참여자를 추가한다.")
	public ResponseEntity<?> createRoom(@RequestBody @Valid final RoomCreateReq roomCreateReq, HttpServletResponse response, HttpServletRequest request, @RequestAttribute("email") String email) {

		RoomJwtTokenClaims roomJwtTokenClaims = roomService.createRoom(roomCreateReq, email);
		RoomJwtTokenDto roomJwtTokenDto = roomTokenManager.createRoomJwtToken(roomJwtTokenClaims);

		CookieUtils.createSessionCookie(response, "roomToken", roomJwtTokenDto.getRoomToken());

		return ResponseEntity.status(HttpStatus.CREATED).body(roomJwtTokenClaims);
	}

	@PatchMapping("/{roomUUID}")
	@Operation(summary = "✨ 방 정보 변경하기", description = "방에 대한 정보를 변경한다.")
	public ResponseEntity<?> updateRoom(@PathVariable UUID roomUUID, @RequestBody RoomUpdateReq roomUpdateReq) {
		roomService.updateRoom(roomUUID, roomUpdateReq);

		return ResponseEntity.status(HttpStatus.OK).body(null);
	}

	// todo 모임 중심 위치가 마지막에 변경되면 변경된 중심역과 해당 역과의 참여자들의 route, duration 계산하기
	@PatchMapping("/{roomUUID}/move")
	@Operation(summary = "✨ 방 중심 위치 수정", description = "방 중심 위치 수정이 게임끝나고 모임위치 결정하고 나면 보낸다.")
	public ResponseEntity<?> moveRoom(@PathVariable UUID roomUUID, @RequestBody RoomMoveReq roomMoveReq) {
		RoomMoveRes roomMoveRes = roomMapService.moveRoom(roomUUID, roomMoveReq);

		return ResponseEntity.status(HttpStatus.OK).body(roomMoveRes);
	}

	@GetMapping("/{roomUUID}/middle")
	@Operation(summary = "✨ 중심점 찾기", description = "그라함 알고리즘을 사용해서 방의 사용자의 좌표들을 읽어서 중심점을 찾는다")
	public ResponseEntity<?> getMiddleStation(@PathVariable UUID roomUUID){
		RoomMiddleRes roomMiddleRes = roomMapService.getMiddleStation(roomUUID);

		return ResponseEntity.status(HttpStatus.OK).body(roomMiddleRes);
	}

	@GetMapping("/{roomUUID}/around")
	@Operation(summary = "✨ 중심점 주변역 찾기", description = "중심점 주변 역을 찾는다.")
	public ResponseEntity<?> getAroundStation(@PathVariable UUID roomUUID){
		List<SubwayInfo> aroundStation = roomMapService.getAroundStation(roomUUID);

		return ResponseEntity.status(HttpStatus.OK).body(aroundStation);
	}

	@GetMapping("/{roomUUID}/around2")
	@Operation(summary = "✨ 중심점 주변역 찾기 + 주변 상권", description = "중심점 주변 역을 찾는다.")
	public ResponseEntity<?> getAroundStation2(@PathVariable UUID roomUUID){
		List<SubwayLocalInfo> aroundStation = roomMapService.getAroundStation2(roomUUID);

		return ResponseEntity.status(HttpStatus.OK).body(aroundStation);
	}

	@PostMapping("/{roomUUID}/join")
	@Operation(summary = "✨ 참여자가 방에 입장한다.", description = "사용자가 방에 입장한다. cookie(roomToken)을 준다, 해당 방에 참여자를 추가한다.")
	public ResponseEntity<?> joinRoom(@PathVariable UUID roomUUID, @RequestBody AttendeeCreateReq attendeeCreateReq, HttpServletResponse response, @RequestAttribute("email") String email){

		RoomJoinRes roomJoinRes = attendeeService.createAttendee(roomUUID, attendeeCreateReq, email);
		RoomJwtTokenDto roomJwtTokenDto = roomTokenManager.createRoomJwtToken(RoomJwtTokenClaims.of(roomJoinRes));

		CookieUtils.createSessionCookie(response, "roomToken", roomJwtTokenDto.getRoomToken());

		return ResponseEntity.status(HttpStatus.CREATED).body(roomJoinRes);
	}


}
