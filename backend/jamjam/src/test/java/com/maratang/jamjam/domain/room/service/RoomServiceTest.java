package com.maratang.jamjam.domain.room.service;

import com.maratang.jamjam.config.IntegrationTestConfig;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.entity.AttendeeStatus;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.attendee.service.AttendeeService;
import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomMoveReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.entity.RoomStatus;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.room.constant.ProfileType;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenClaims;
import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

class RoomServiceTest extends IntegrationTestConfig {
    private final RoomService roomService;
    private final RoomRepository roomRepository;
    private final AttendeeService attendeeService;
    private final AttendeeRepository attendeeRepository;

    @Autowired
    public RoomServiceTest(RoomService roomService, RoomRepository roomRepository, AttendeeService attendeeService, AttendeeRepository attendeeRepository) {
        this.roomService = roomService;
        this.roomRepository = roomRepository;
        this.attendeeService = attendeeService;
        this.attendeeRepository = attendeeRepository;
    }

    private Room room;
    private Attendee attendee;
    private UUID roomUUID;

    @BeforeEach
    void setUp() {
        // Create Room and Attendee
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
    @DisplayName("방 성공/수정/삭제 테스트 ")
    class RoomFunction {
        @Test
        @Transactional
        void 성공_방을_생성한다(){
            //given
            String purpose = "스터디룸";
            LocalDateTime meetingDate = LocalDateTime.parse("2024-08-11T05:14:01.290");
            String nickName = "씩씩한 호랑이";

            RoomCreateReq roomCreateReq = new RoomCreateReq(purpose, meetingDate, nickName);

            //when
            RoomJwtTokenClaims roomJwtTokenClaims = roomService.createRoom(roomCreateReq);

            // then
            SoftAssertions.assertSoftly(softAssertions -> {
                softAssertions.assertThat(roomRepository.findByRoomUUID(roomJwtTokenClaims.getRoomUUID()))
                        .isPresent()
                        .hasValueSatisfying(room ->
                                softAssertions.assertThat(room.getName()).isEqualTo("씩씩한 호랑이님의 방"));
            });
        }

        @Test
        void 성공_방을_업데이트_한다() {
            //given
            String purpose = "스터디룸";
            LocalDateTime meetingDate = LocalDateTime.parse("2024-08-11T05:14:01.290");
            String name = "젠킨스 스터디 방";

            //when
            roomService.updateRoom(roomUUID, new RoomUpdateReq(meetingDate, name, purpose));

            //then
            SoftAssertions.assertSoftly(softAssertions -> {
                // 업데이트된 방을 조회
                softAssertions.assertThat(roomRepository.findByRoomUUID(roomUUID))
                        .isPresent()
                        .hasValueSatisfying(room -> {
                            softAssertions.assertThat(room.getName()).isEqualTo(name);
                            softAssertions.assertThat(room.getPurpose()).isEqualTo(purpose);
                            softAssertions.assertThat(room.getMeetingDate()).isEqualTo(meetingDate);
                        });
            });
        }

        //todo 가운데 지점을 찾는 부분에 대한 localInfo 가 필요하지만 h2에는 추가할 수 없음
        @Test
        void getMiddleStation() {
            // Implement test logic
        }

        @Test
        void 성공_방의_중심역_위치를_변경한다() {
            //given
            String finalStation = "역삼역";
            RoomMoveReq roomMoveReq = new RoomMoveReq(finalStation);

            //when
            roomService.moveRoom(roomUUID, roomMoveReq);

            //then
            SoftAssertions.assertSoftly(softAssertions -> {
                softAssertions.assertThat(roomRepository.findByRoomUUID(roomUUID))
                        .isPresent()
                        .hasValueSatisfying(room -> {
                            softAssertions.assertThat(room.getStartStation()).isEqualTo(finalStation);
                        });
            });
        }

    }

}
