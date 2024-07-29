package com.maratang.jamjam.domain.room.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.mapper.AttendeeMapper;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.mapper.RoomMapper;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenCliams;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {
	private final RoomRepository roomRepository;
	private final AttendeeRepository attendeeRepository;

	@Transactional
	public RoomJwtTokenCliams createRoom(RoomCreateReq roomCreateReq) {
		Room room = RoomMapper.INSTANCE.roomCreateReqToAttendee(roomCreateReq);
		Attendee attendee = AttendeeMapper.INSTANCE.attendeeCreateReqToAttendee(roomCreateReq.getNickname(), room);

		room.updateAttendee(attendee);

		attendeeRepository.save(attendee);
		roomRepository.save(room);

		UUID roomUUID = room.getRoomUUID();

		RoomJwtTokenCliams roomJwtTokenCliams = RoomJwtTokenCliams.builder()
			.roomUUID(roomUUID)
			.attendeeUUID(attendee.getAttendeeUUID())
			.build();

		return roomJwtTokenCliams;
	}

	@Transactional
	public void updateRoom(RoomUpdateReq roomUpdateReq) {
		Room room = roomRepository.findById(roomUpdateReq.getRoomId())
				.orElseThrow(()->new BusinessException(ErrorCode.RO_NOT_VALID_ROOM));

		room.updateRoom(roomUpdateReq);
	}
}
