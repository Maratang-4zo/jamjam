package com.maratang.jamjam.domain.attendee.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.config.IntegrationTestConfig;
import com.maratang.jamjam.domain.attendee.dto.request.AttendeeCreateReq;
import com.maratang.jamjam.domain.attendee.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.entity.AttendeeStatus;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.room.dto.response.RoomJoinRes;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.entity.RoomStatus;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.auth.room.RoomTokenProvider;
import com.maratang.jamjam.global.auth.room.constant.ProfileType;
import com.maratang.jamjam.global.auth.room.dto.RoomJwtTokenClaims;

import io.jsonwebtoken.Claims;

@Transactional
class AttendeeServiceTest extends IntegrationTestConfig {

	private final RoomRepository roomRepository;
	private final AttendeeRepository attendeeRepository;
	private final AttendeeService attendeeService;
	private final RoomTokenProvider roomTokenProvider;

	@Autowired
	public AttendeeServiceTest(RoomRepository roomRepository, AttendeeRepository attendeeRepository,
		AttendeeService attendeeService, RoomTokenProvider roomTokenProvider) {
		this.roomRepository = roomRepository;
		this.attendeeRepository = attendeeRepository;
		this.attendeeService = attendeeService;
		this.roomTokenProvider = roomTokenProvider;
	}

	private Room room;
	private Attendee attendee;
	private UUID roomUUID;

	@BeforeEach
	void setUp() {
		this.room = createRoom();
		this.attendee = createAttendee(this.room);

		// Save Room first
		this.room = roomRepository.save(this.room);
		this.roomUUID = room.getRoomUUID();

		// Update Attendee with the saved Room
		this.attendee.updateRoom(this.room);

		// Save Attendee second
		attendeeRepository.save(this.attendee);
	}

	private Room createRoom() {
		return Room.builder()
			.name("카페")
			.purpose("스터디 모임")
			.startStation("Gangnam")
			.finalStation("Jamsil")
			.meetingDate(LocalDateTime.parse("2024-08-11T05:14:01.290"))
			.roomStatus(RoomStatus.ONGOING)
			.attendees(new ArrayList<>())
			.roomUUID(UUID.randomUUID())
			.build();
	}

	private Attendee createAttendee(Room room) {
		return Attendee.builder()
			.nickname("홍길동")
			.member(null)
			.room(room)
			.attendeeUUID(UUID.randomUUID())
			.attendeeStatus(AttendeeStatus.ENTERED)
			.lat(37.5665)
			.lon(126.9780)
			.address("서울특별시 중구 세종대로")
			.memberRoundRecord(null)
			.duration(3600L)
			.route("서울역 -> 시청역 -> 광화문역")
			.profileImageUrl(ProfileType.PROFILE1)
			.build();
	}

	@Nested
	@DisplayName("참여자 생성/수정 테스트")
	class AttendeeFunction {

		@Test
		void 성공_참여자_생성한다() {
			//given
			String nickName = "기분좋은고릴라";
			AttendeeCreateReq attendeeCreateReq = new AttendeeCreateReq(nickName);
			String email = "mycommon202407@gmail.com";

			//when
			RoomJoinRes roomJoinRes = attendeeService.createAttendee(roomUUID, attendeeCreateReq, email);

			//then
			SoftAssertions.assertSoftly(softAssertions -> {
				softAssertions.assertThat(attendeeRepository.findByAttendeeUUID(roomJoinRes.getAttendeeUUID()))
					.isPresent()
					.hasValueSatisfying(attendee -> {
						softAssertions.assertThat(attendee.getNickname()).isEqualTo(nickName);
					});
			});
		}

		@Test
		void 성공_참여자_수정한다() {
			//given
			Double lat = 37.389854;
			Double lon = 126.950627;
			String address = "범계역";
			AttendeeUpdateReq attendeeUpdateReq = new AttendeeUpdateReq(lat, lon, address);

			RoomJwtTokenClaims roomJwtTokenClaims = RoomJwtTokenClaims.builder()
				.roomUUID(roomUUID)
				.attendeeUUID(attendee.getAttendeeUUID())
				.build();

			String roomToken = roomTokenProvider.createRoomJwtToken(roomJwtTokenClaims).getRoomToken();

			Claims claims = roomTokenProvider.getTokenClaims(roomToken);

			//when
			attendeeService.updateAttendee(
				attendeeUpdateReq,
				UUID.fromString((String) claims.get("roomUUID")),
				UUID.fromString((String) claims.get("attendeeUUID"))
			);


			//then
			SoftAssertions.assertSoftly(softAssertions -> {
				softAssertions.assertThat(attendee.getLat()).isEqualTo(lat);
				softAssertions.assertThat(attendee.getLon()).isEqualTo(lon);
				softAssertions.assertThat(attendee.getAddress()).isEqualTo(address);
			});
		}
	}
}
