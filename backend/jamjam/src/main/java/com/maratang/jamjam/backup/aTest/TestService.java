package com.maratang.jamjam.backup.aTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.maratang.jamjam.domain.attendee.dto.response.AttendeeInfo;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.entity.RoomStatus;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TestService {

	private final AttendeeRepository attendeeRepository;
	private final RoomRepository roomRepository;

	public List<AttendeeInfo> getAllAttendee() {
		return AttendeeInfo.of(attendeeRepository.findAll());
	}


	public void getAttendeeList(UUID roomUUID, UUID attendeeUUID, String userId){
		List<Attendee> attendeeList = attendeeRepository.findByRoom_RoomUUID(roomUUID);
		List<AttendeeInfo> dtoList = AttendeeInfo.of(attendeeList);

		// messagingTemplate.convertAndSendToUser(userId, "/sub/rooms/" + roomUuid, dtoList);
	}

	public List<RoomTestRes> getAllRoom() {
		return RoomTestRes.of(roomRepository.findAll());
	}

	@Transactional
	public void resetRoom(Long roomId) {
		Room room = roomRepository.findById(roomId).orElseThrow(() -> new BusinessException(ErrorCode.BAD_REQUEST));

		room.updateStatus(RoomStatus.CREATED);
		attendeeRepository.resetAttendees(roomId);

	}


	@Transactional
	public void createRoom() {
		Attendee attendee = Attendee.builder()
			.nickname("trtr")
			.build();

		Room room = Room.builder()
			.name("tr")
			.purpose("tr")
			.roomStatus(RoomStatus.CREATED)
			.meetingDate(LocalDateTime.now())
			.startStation("역삼역")
			.root(attendee)
			.build();

		attendeeRepository.save(attendee);
		roomRepository.save(room);

		attendee.updateRoom(room);

		for(int i = 0; i < 3; i++){
			Attendee attendee2 = Attendee.builder()
				.nickname("trtr")
				.room(room)
				.build();
			attendeeRepository.save(attendee2);
		}
	}
}
