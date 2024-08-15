package com.maratang.jamjam.backup.aTest;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.global.auth.room.RoomTokenManager;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenClaims;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenDto;
import com.maratang.jamjam.global.util.CookieUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {

	private final RoomTokenManager roomTokenManager;
	private final AttendeeRepository attendeeRepository;
	private final TestService testService;

	@GetMapping("/cookietest")
	public ResponseEntity<?> cookietest(HttpServletRequest request, HttpServletResponse response){
		CookieUtils.createSessionCookie(response, "test", "hi");
		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@GetMapping("/attendees")
	public ResponseEntity<?> getAllAttendee(){
		return ResponseEntity.status(HttpStatus.OK).body(testService.getAllAttendee());
	}


	@GetMapping("/rooms")
	public ResponseEntity<?> getAllRoom(){
		return ResponseEntity.status(HttpStatus.OK).body(testService.getAllRoom());
	}

	@GetMapping("/attendees/{attendeeId}")
	public ResponseEntity<?> getToken(@PathVariable Long attendeeId, HttpServletResponse response){
		Attendee attendee = attendeeRepository.findById(attendeeId).orElseThrow();
		UUID attendeeUUID = attendee.getAttendeeUUID();
		UUID roomUUID = attendee.getRoom().getRoomUUID();

		RoomJwtTokenClaims roomJwtTokenClaims = RoomJwtTokenClaims.builder()
			.roomUUID(roomUUID)
			.attendeeUUID(attendeeUUID)
			.build();
		RoomJwtTokenDto roomJwtTokenDto = roomTokenManager.createRoomJwtToken(roomJwtTokenClaims);
		CookieUtils.createSessionCookie(response, "roomToken", roomJwtTokenDto.getRoomToken());
		CookieUtils.createSessionCookie(response, "roomUUID", roomUUID.toString());
		return ResponseEntity.status(HttpStatus.OK).body(roomJwtTokenDto);
	}

	@PatchMapping("/rooms/{roomId}/reset")
	public ResponseEntity<?> resetRoom(@PathVariable Long roomId){
		testService.resetRoom(roomId);
		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@PostMapping("/rooms")
	public ResponseEntity<?> createRoom(){
		testService.createRoom();
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
}
