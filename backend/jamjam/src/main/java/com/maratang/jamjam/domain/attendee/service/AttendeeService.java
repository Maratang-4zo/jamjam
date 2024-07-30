package com.maratang.jamjam.domain.attendee.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeCreateReq;
import com.maratang.jamjam.domain.attendee.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.mapper.AttendeeMapper;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenCliams;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendeeService {
	private final AttendeeRepository attendeeRepository;
	private final RoomRepository roomRepository;

	@Transactional
	public RoomJwtTokenCliams createAttendee(AttendeeCreateReq attendeeCreateReq) {
		Attendee attendee = AttendeeMapper.INSTANCE.attendeeCreateReqToAttendee(attendeeCreateReq);
		attendeeRepository.save(attendee);

		UUID attendeeUUID = attendee.getAttendeeUUID();
		UUID roomUUID = roomRepository.findById(attendeeCreateReq.getRoomId())
			.orElseThrow(()->new BusinessException(ErrorCode.ROOM_NOT_FOUND)).getRoomUUID();

		RoomJwtTokenCliams roomJwtTokenCliams = RoomJwtTokenCliams.builder()
			.roomUUID(roomUUID)
			.attendeeUUID(attendeeUUID)
			.build();


		return roomJwtTokenCliams;
	}

	@Transactional
	public void updateAttendee(AttendeeUpdateReq attendeeUpdateReq) {
		Attendee attendee = attendeeRepository.findById(attendeeUpdateReq.getAttendeeId())
			.orElseThrow(()->new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));

		attendee.updateAttendeeLocation(attendeeUpdateReq);
	}
}
