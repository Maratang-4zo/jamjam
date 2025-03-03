package com.maratang.jamjam.domain.attendee.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.dto.AttendeeDTO;
import com.maratang.jamjam.domain.attendee.dto.request.AttendeeCreateReq;
import com.maratang.jamjam.domain.attendee.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.attendee.dto.response.AttendeeIsAllHasRes;
import com.maratang.jamjam.domain.attendee.dto.response.AttendeeUpdateRes;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.service.MemberService;
import com.maratang.jamjam.domain.room.dto.response.RoomJoinRes;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.map.station.SubwayDataLoader;
import com.maratang.jamjam.global.map.station.SubwayInfo;
import com.maratang.jamjam.global.ws.BroadCastService;
import com.maratang.jamjam.global.ws.BroadCastType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendeeService {
	private final AttendeeRepository attendeeRepository;
	private final RoomRepository roomRepository;
	private final SubwayDataLoader subwayDataLoader;
	private final MemberService memberService;
	private final BroadCastService broadCastService;

	@Transactional
	public RoomJoinRes createAttendee(UUID roomUUID, AttendeeCreateReq attendeeCreateReq, String email) {
		Attendee attendee = attendeeCreateReq.toEntity();

		if(!email.isEmpty()){
			Member member = memberService.findMemberByEmail(email);
			attendee.updateMember(member);
		}

		attendeeRepository.save(attendee);

		UUID attendeeUUID = attendee.getAttendeeUUID();

		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		attendee.updateRoom(room);

		List<Attendee> attendees = attendeeRepository.findAllByRoomId(room.getRoomId());
		List<AttendeeDTO> attendeeList = AttendeeDTO.of(attendees);

		String startStation = room.getStartStation();

		SubwayInfo roomCenterStart = subwayDataLoader.getSubwayInfo(startStation);

		return RoomJoinRes.of(roomUUID, attendeeUUID, room, roomCenterStart, attendeeList);
	}

	@Transactional
	public AttendeeIsAllHasRes updateAttendee(AttendeeUpdateReq attendeeUpdateReq, UUID roomUUID, UUID attendeeUUID) {
 		Attendee attendee = attendeeRepository.findByAttendeeUUID(attendeeUUID)
			.orElseThrow(()->new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));

		attendee.updateAttendeeLocation(attendeeUpdateReq);

		Room room = roomRepository.findByRoomUUID(roomUUID)
				.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		boolean isAllHasDeparture = room.getAttendees().stream()
			.allMatch(attendeeTmp -> attendeeTmp.getLat() != null && attendeeTmp.getLon() != null);
		room.updateIsCenterExist(false);

		broadCastService.broadcastToRoom(roomUUID, AttendeeUpdateRes.of(attendee, isAllHasDeparture, false), BroadCastType.DEPARTURE_UPDATE);

		return AttendeeIsAllHasRes.builder()
			.isAllHasDeparture(isAllHasDeparture)
			.isCenterExist(room.isCenterExist())
			.build();
	}
}
