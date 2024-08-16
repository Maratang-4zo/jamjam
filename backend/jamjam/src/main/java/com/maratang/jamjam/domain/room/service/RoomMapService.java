package com.maratang.jamjam.domain.room.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.dto.AttendeeDTO;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.entity.AttendeeStatus;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.localInfo.dto.response.LocalInfoRes;
import com.maratang.jamjam.domain.localInfo.service.LocalInfoService;
import com.maratang.jamjam.domain.room.dto.request.RoomMoveReq;
import com.maratang.jamjam.domain.room.dto.response.CenterLoadingDto;
import com.maratang.jamjam.domain.room.dto.response.RoomMiddleRes;
import com.maratang.jamjam.domain.room.dto.response.RoomMoveRes;
import com.maratang.jamjam.domain.room.dto.response.SubwayLocalInfo;
import com.maratang.jamjam.domain.room.dto.response.ThreeLoadingRes;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.map.middle.GeometryUtils;
import com.maratang.jamjam.global.map.middle.GrahamScan;
import com.maratang.jamjam.global.map.middle.HaversineDistance;
import com.maratang.jamjam.global.map.middle.dto.GoogleDirectionsRes;
import com.maratang.jamjam.global.map.station.Point;
import com.maratang.jamjam.global.map.station.SubwayDataLoader;
import com.maratang.jamjam.global.map.station.SubwayInfo;
import com.maratang.jamjam.global.ws.BroadCastService;
import com.maratang.jamjam.global.ws.BroadCastType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomMapService {

	private static final double SEARCH_RADIUS = 2.0; // 5km
	private static final List<String> VALID_PURPOSES = Arrays.asList("스터디룸", "식당", "카페", "호프", "헬스클럽", "도서관", "공원", "미술관", "애견카페", "셀프사진");

	private final AttendeeRepository attendeeRepository;
	private final GrahamScan grahamScan;
	private final GeometryUtils geometryUtils;
	private final SubwayDataLoader subwayDataLoader;
	private final HaversineDistance haversineDistance;
	private final RoomRepository roomRepository;
	private final BroadCastService broadCastService;
	private final GoogleDirectionsService googleDirectionsService;
	private final LocalInfoService localInfoService;

	private void saveOptimalRoutesForUsersInRoom(Room room, SubwayInfo selectedStation) {
		List<Attendee> attendees = attendeeRepository.findAllByRoomId(room.getRoomId());
		List<AttendeeDTO> attendeeList = AttendeeDTO.of(attendees);

		List<AttendeeDTO> attendeesEntered = attendeeList.stream()
				.filter(attendee -> attendee.getStatus() == AttendeeStatus.ENTERED || attendee.getStatus() == AttendeeStatus.CREATED)
				.toList();


		attendeesEntered.forEach(attendee -> processAttendeeRoute(attendee, selectedStation));

		room.updateIsCenterExist(true);
		attendeeRepository.saveAll(attendees);
	}

	private void processAttendeeRoute(AttendeeDTO attendee, SubwayInfo selectedStation) {
		String fromPlace = attendee.getLat() + "," + attendee.getLon();
		String toPlace = selectedStation.getLatitude() + "," + selectedStation.getLongitude();

		// Google Directions API를 호출하여 결과를 받습니다.
		GoogleDirectionsRes googleDirectionsRes = googleDirectionsService.getFixedDirections(fromPlace, toPlace);

		System.out.println(googleDirectionsRes.toString());

		if (!googleDirectionsRes.getRoutes().isEmpty()) {
			long totalDuration = 0;

			// 첫 번째 경로(Route)만 사용
			GoogleDirectionsRes.Route route = googleDirectionsRes.getRoutes().getFirst();

			// overview_polyline의 points 값을 가져옵니다.
			String polylinePoints = route.getOverviewPolyline().getPoints();

			// 각 경로의 legs를 순회하며 총 소요 시간 및 총 이동 거리 계산
			for (GoogleDirectionsRes.Leg leg : route.getLegs()) {
				totalDuration += leg.getDuration().getValue(); // 소요 시간(초 단위) 누적
			}

			// Attendee 정보를 갱신합니다.
			Attendee attendeeEntity = attendeeRepository.findByAttendeeUUID(attendee.getAttendeeUUID())
					.orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));

			attendeeEntity.updateDuration(totalDuration);
			attendeeEntity.updateRoute(polylinePoints);
		}
	}


	public List<SubwayLocalInfo> getAroundStation2(UUID roomUUID) {
		Room room = findRoomByUUID(roomUUID);
		broadCastService.broadcastToRoom(roomUUID, ThreeLoadingRes.of(true), BroadCastType.WINNER_NEXT_PAGE);
		validateStartStation(room);
		String purpose = room.getPurpose();

		SubwayInfo point = subwayDataLoader.getSubwayInfoMap().get(room.getStartStation());
		List<SubwayInfo> aroundStations = haversineDistance.aroundStation(
			subwayDataLoader.getSubwayInfoMap(), point.getLatitude(), point.getLongitude(), SEARCH_RADIUS, room.getPurpose());

		if (aroundStations.isEmpty()) {
			throw new BusinessException(ErrorCode.MIDDLE_NOT_FOUND_STATION_LOCATION);
		}

		List<SubwayLocalInfo> subwayLocalInfos = new ArrayList<>();
		for(SubwayInfo subwayInfo: aroundStations) {
			List<LocalInfoRes> res = localInfoService.getLocalInfoList(subwayInfo.getName(), purpose);
			subwayLocalInfos.add(new SubwayLocalInfo(subwayInfo, res));
		}

		broadCastService.broadcastToRoom(roomUUID, subwayLocalInfos, BroadCastType.AROUND_STATIONS);

		return subwayLocalInfos;
	}

	public List<SubwayInfo> getAroundStation(UUID roomUUID) {
		Room room = findRoomByUUID(roomUUID);
		broadCastService.broadcastToRoom(roomUUID, ThreeLoadingRes.of(true), BroadCastType.WINNER_NEXT_PAGE);
		validateStartStation(room);
		String purpose = room.getPurpose();

		SubwayInfo point = subwayDataLoader.getSubwayInfoMap().get(room.getStartStation());
		List<SubwayInfo> aroundStations = haversineDistance.aroundStation(
			subwayDataLoader.getSubwayInfoMap(), point.getLatitude(), point.getLongitude(), SEARCH_RADIUS, room.getPurpose());

		if (aroundStations.isEmpty()) {
			throw new BusinessException(ErrorCode.MIDDLE_NOT_FOUND_STATION_LOCATION);
		}

		return aroundStations;
	}

	@Transactional
	public RoomMoveRes moveRoom(UUID roomUUID, RoomMoveReq roomMoveReq) {
		Room room = findRoomByUUID(roomUUID);
		SubwayInfo selectedStation = subwayDataLoader.getSubwayInfo(roomMoveReq.getStartStation());

		room.updateStartStation(selectedStation.getName());
		saveOptimalRoutesForUsersInRoom(room, selectedStation);
		room.updateFinalStation(selectedStation.getName());

		List<AttendeeDTO> attendeeList = AttendeeDTO.of(attendeeRepository.findAllByRoomId(room.getRoomId()));
		return RoomMoveRes.of(selectedStation, attendeeList);
	}

	@Transactional
	public RoomMiddleRes getMiddleStation(UUID roomUUID) {
		Room room = findRoomByUUID(roomUUID);
		broadCastService.broadcastToRoom(roomUUID, CenterLoadingDto.of(true), BroadCastType.HOST_FIND_CENTER);

		validateRoomPurpose(room);

		Point centroid = calculateCentroid(room);
		SubwayInfo selectedStation = findNearestStation(centroid, room.getPurpose());

		saveOptimalRoutesForUsersInRoom(room, selectedStation);
		updateRoomStations(room, selectedStation);

		List<AttendeeDTO> attendeeList = AttendeeDTO.of(attendeeRepository.findAllByRoomId(room.getRoomId()));
		RoomMiddleRes res = RoomMiddleRes.of(selectedStation, attendeeList);
		broadCastService.broadcastToRoom(roomUUID, res, BroadCastType.ROOM_CENTER_UPDATE);
		return res;
	}

	private Room findRoomByUUID(UUID roomUUID) {
		return roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
	}

	private void validateStartStation(Room room) {
		if (room.getStartStation() == null) {
			throw new BusinessException(ErrorCode.MIDDLE_NOT_SET_START_LOCATION);
		}
	}

	private void validateRoomPurpose(Room room) {
		if (!VALID_PURPOSES.contains(room.getPurpose())) {
			throw new BusinessException(ErrorCode.MIDDLE_NOT_FOUND_PURPOSE_LOCATION);
		}
	}

	private Point calculateCentroid(Room room) {
		List<Point> points = room.getAttendees().stream()
			.filter(attendee -> attendee.getLat() != null && attendee.getLon() != null)
			.map(attendee -> new Point(attendee.getLat(), attendee.getLon()))
			.collect(Collectors.toList());

		List<Point> grahamPoints = grahamScan.convexHull(points);
		return geometryUtils.calculateCentroid(grahamPoints);
	}

	private SubwayInfo findNearestStation(Point centroid, String purpose) {
		SubwayInfo selectedStation = haversineDistance.selectStation(
			subwayDataLoader.getSubwayInfoMap(), centroid.getX(), centroid.getY(), SEARCH_RADIUS, purpose);

		if (selectedStation == null) {
			throw new BusinessException(ErrorCode.MIDDLE_NOT_FOUND_STATION_LOCATION);
		}

		return selectedStation;
	}

	private void updateRoomStations(Room room, SubwayInfo station) {
		room.updateStartStation(station.getName());
		room.updateFinalStation(station.getName());
	}
}