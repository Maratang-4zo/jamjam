package com.maratang.jamjam.domain.attendee.service;

import com.maratang.jamjam.domain.attendee.dto.AttendeeDTO;
import com.maratang.jamjam.domain.attendee.dto.request.AttendeeCreateReq;
import com.maratang.jamjam.domain.attendee.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.mapper.AttendeeMapper;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.room.dto.response.RoomJoinRes;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.room.RoomTokenProvider;
import com.maratang.jamjam.global.station.SubwayDataLoader;
import com.maratang.jamjam.global.station.SubwayInfo;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendeeService {
	private final AttendeeRepository attendeeRepository;
	private final RoomRepository roomRepository;
	private final RoomTokenProvider roomTokenProvider;
	private final SubwayDataLoader subwayDataLoader;

	@Transactional
	public RoomJoinRes createAttendee(UUID roomUUID, AttendeeCreateReq attendeeCreateReq) {
		Attendee attendee = AttendeeMapper.INSTANCE.attendeeCreateReqToAttendee(attendeeCreateReq);

		attendeeRepository.save(attendee);

		UUID attendeeUUID = attendee.getAttendeeUUID();

		Room room = roomRepository.findByRoomUUID(roomUUID)
				.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		attendee.updateRoom(room);

		List<Attendee> attendees = attendeeRepository.findAllByRoomId(room.getRoomId());
		List<AttendeeDTO> attendeeList = AttendeeDTO.of(attendees);

		String startStation = room.getStartStation();

		SubwayInfo roomCenterStart = subwayDataLoader.getSubwayInfo(startStation);

		return RoomJoinRes.builder()
				.RoomUUID(roomUUID)
				.AttendeeUUID(attendeeUUID)
				.roomName(room.getName())
				.roomCenterStart(roomCenterStart)
				.roomTime(room.getMeetingDate())
				.roomPurpose(room.getPurpose())
				.hostUUID(room.getRoomUUID())
				.attendees(attendeeList)
				.build();
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
