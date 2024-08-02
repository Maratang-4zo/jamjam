package com.maratang.jamjam.domain.attendee.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeCreateReq;
import com.maratang.jamjam.domain.attendee.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.mapper.AttendeeMapper;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.room.RoomTokenProvider;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenCliams;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendeeService {
	private final AttendeeRepository attendeeRepository;
	private final RoomRepository roomRepository;
	private final RoomTokenProvider roomTokenProvider;

	@Transactional
	public RoomJwtTokenCliams createAttendee(AttendeeCreateReq attendeeCreateReq) {
		Attendee attendee = AttendeeMapper.INSTANCE.attendeeCreateReqToAttendee(attendeeCreateReq);

		attendeeRepository.save(attendee);

		UUID attendeeUUID = attendee.getAttendeeUUID();
		UUID roomUUID = attendeeCreateReq.getRoomUUID();

		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(()-> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		attendee.updateRoom(room);

		RoomJwtTokenCliams roomJwtTokenCliams = RoomJwtTokenCliams.builder()
			.roomUUID(roomUUID)
			.attendeeUUID(attendeeUUID)
			.build();

		return roomJwtTokenCliams;
	}

	@Transactional
	public void updateAttendee(AttendeeUpdateReq attendeeUpdateReq, String roomToken) {
		Claims claims = roomTokenProvider.getTokenClaims(roomToken);

		String attendeeUUIDString = (String) claims.get("attendeeUUID");

		UUID attendeeUUID = UUID.fromString(attendeeUUIDString);

 		Attendee attendee = attendeeRepository.findByAttendeeUUID(attendeeUUID)
			.orElseThrow(()->new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));

		attendee.updateAttendeeLocation(attendeeUpdateReq);
	}
}
