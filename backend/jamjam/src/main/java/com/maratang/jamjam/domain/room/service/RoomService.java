package com.maratang.jamjam.domain.room.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.mapper.AttendeeMapper;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.board.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomCreateReq;
import com.maratang.jamjam.domain.room.dto.request.RoomEnterReq;
import com.maratang.jamjam.domain.room.dto.request.RoomUpdateReq;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.mapper.RoomMapper;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.middle.GeometryUtils;
import com.maratang.jamjam.global.middle.GrahamScan;
import com.maratang.jamjam.global.middle.HaversineDistance;
import com.maratang.jamjam.global.room.dto.RoomJwtTokenClaims;
import com.maratang.jamjam.global.station.Point;
import com.maratang.jamjam.global.station.SubwayDataLoader;
import com.maratang.jamjam.global.station.SubwayInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {
	private final SimpMessagingTemplate messagingTemplate;
	private final String ROOM_SUBSCRIBE_DEST = "/sub/rooms/{roomId}";
	private final RoomRepository roomRepository;
	private final AttendeeRepository attendeeRepository;
	private final GrahamScan grahamScan;
	private final GeometryUtils geometryUtils;
	private final SubwayDataLoader subwayDataLoader;

	@Transactional
	public RoomJwtTokenClaims createRoom(RoomCreateReq roomCreateReq) {
		Room room = RoomMapper.INSTANCE.roomCreateReqToAttendee(roomCreateReq);

		Attendee attendee = AttendeeMapper.INSTANCE.attendeeCreateReqToAttendee(roomCreateReq);

		room.updateAttendee(attendee);

		attendeeRepository.save(attendee);
		roomRepository.save(room);

		attendee.updateRoom(room);

		UUID roomUUID = room.getRoomUUID();

		RoomJwtTokenClaims roomJwtTokenClaims = RoomJwtTokenClaims.builder()
			.roomUUID(roomUUID)
			.attendeeUUID(attendee.getAttendeeUUID())
			.build();

		return roomJwtTokenClaims;
	}

	@Transactional
	public void updateRoom(UUID roomUUID, RoomUpdateReq roomUpdateReq) {
		// 1. DB 상태 변경
		// 2. 참여자들에게 알리기
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		room.updateRoom(roomUpdateReq);
	}

	public SubwayInfo getMiddleStation(UUID roomUUID) {
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		// Transforming attendees' coordinates into Point instances, skipping null values
		List<Point> points = room.getAttendees().stream()
			.filter(attendee -> attendee.getLat() != null && attendee.getLon() != null)
			.map(attendee -> new Point(attendee.getLat(), attendee.getLon()))
			.collect(Collectors.toList());

		List<Point> grahamPoints = grahamScan.convexHull(points);

		Point centroid = geometryUtils.calculateCentroid(grahamPoints);

		Map<String, SubwayInfo> subwayMap = subwayDataLoader.getSubwayInfoMap();

		double searchRadius = 5.0; // 5km
		short stationCnt = 5;

		SubwayInfo nearbyStations = HaversineDistance.findNearbyStations(subwayMap, centroid.getX(),
			centroid.getY(), searchRadius,stationCnt);

		return nearbyStations;
	}

	public void enterRoom(UUID roomUUID, RoomEnterReq enterRequest) {
		// 1. 미팅룸 유효성 검사
		// 2. 닉네임, 출발지 등 입력하는 시점 확인 필요
		// 3. 기존 참여자들에게 입장 알림
		// 4. 새 참여자에게는 현재 참여자 목록 알려주기

		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST, enterRequest.getNickname() + "입장");
		messagingTemplate.convertAndSendToUser("userUUID", "", null);
	}

	public void leaveRoom(UUID roomUUID) {
		// 1. DB 상태 변경
		// 2. 참여자가 떠남을 알리기
		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST, "누가 나옴");
	}

	public void closeRoom(UUID roomUUID) {
		// 1. DB 상태 변경
		// 2. 남은 참여자 쫓아내기
	}

	public void updateAttendeeInfo(UUID roomUUID, AttendeeUpdateReq attendeeUpdateReq) {
		// 1. DB 상태 변경
		// 2. 참여자들에게 알리기
		messagingTemplate.convertAndSend(ROOM_SUBSCRIBE_DEST, "");
	}
}
