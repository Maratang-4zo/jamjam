package com.maratang.jamjam.domain.room.service;

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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {
	private final RoomRepository roomRepository;
	private final AttendeeRepository attendeeRepository;

	@Transactional
	public void createRoom(RoomCreateReq roomCreateReq) {
		Room room = RoomMapper.INSTANCE.roomCreateReqToAttendee(roomCreateReq);

		Attendee attendee = AttendeeMapper.INSTANCE.attendeeCreateReqToAttendee(roomCreateReq.getNickname(), room);

		room.updateAttendee(attendee);

		attendeeRepository.save(attendee);

		roomRepository.save(room);
	}

	@Transactional
	public void updateRoom(RoomUpdateReq roomUpdateReq) {
		Room room = roomRepository.getReferenceById(roomUpdateReq.getRoomId());

		room.updateRoom(roomUpdateReq);
	}
}
