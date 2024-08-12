package com.maratang.jamjam.domain.room.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.dto.AttendeeDTO;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.room.dto.request.RoomMoveReq;
import com.maratang.jamjam.domain.room.dto.response.CenterLoadingDto;
import com.maratang.jamjam.domain.room.dto.response.RoomMiddleRes;
import com.maratang.jamjam.domain.room.dto.response.RoomMoveRes;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.map.middle.GeometryUtils;
import com.maratang.jamjam.global.map.middle.GrahamScan;
import com.maratang.jamjam.global.map.middle.HaversineDistance;
import com.maratang.jamjam.global.map.middle.PolylineUtils;
import com.maratang.jamjam.global.map.middle.client.OTPUserClient;
import com.maratang.jamjam.global.map.middle.dto.OTPUserRes;
import com.maratang.jamjam.global.map.station.Point;
import com.maratang.jamjam.global.map.station.SubwayDataLoader;
import com.maratang.jamjam.global.map.station.SubwayInfo;
import com.maratang.jamjam.global.ws.BroadCastService;
import com.maratang.jamjam.global.ws.BroadCastType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomMapService {

	private final AttendeeRepository attendeeRepository;
	private final GrahamScan grahamScan;
	private final GeometryUtils geometryUtils;
	private final SubwayDataLoader subwayDataLoader;
	private final HaversineDistance haversineDistance;
	private final OTPUserClient oTPUserClient;
	private final RoomRepository roomRepository;
	private final BroadCastService broadCastService;

	private void saveOptimalRoutesForUsersInRoomToDatabase(Room room, SubwayInfo selectedStation) {
		List<Attendee> attendees = attendeeRepository.findAllByRoomId(room.getRoomId());
		List<AttendeeDTO> attendeeList = AttendeeDTO.of(attendees);

		List<Map<String, Object>> attendeeDetails = attendeeList.stream()
			.map(attendeeDTO -> {
				Map<String, Object> details = new HashMap<>();
				details.put("attendeeUUID", attendeeDTO.getAttendeeUUID());
				details.put("lat", attendeeDTO.getLat());
				details.put("lon", attendeeDTO.getLon());
				return details;
			})
			.toList();

		for (Map<String, Object> attendeeMap : attendeeDetails) {
			// fromPlace: latitude and longitude of attendee
			String fromPlace = attendeeMap.get("lat") + "," + attendeeMap.get("lon");

			// toPlace: latitude and longitude of selectedStation
			String toPlace = selectedStation.getLatitude() + "," + selectedStation.getLongitude();

			// Call Feign Client to get OTPUserRes
			OTPUserRes otpUserRes = oTPUserClient.getFixedOTPUser(fromPlace, toPlace);

			if (otpUserRes != null && otpUserRes.getPlan() != null) {
				List<OTPUserRes.Plan.Itinerary> itineraries = otpUserRes.getPlan().getItineraries();
				long totalDuration = 0;
				List<double[]> combinedPoints = new ArrayList<>();

				for (OTPUserRes.Plan.Itinerary itinerary : itineraries) {
					totalDuration += itinerary.getDuration();  // Sum durations

					for (OTPUserRes.Plan.Itinerary.Leg leg : itinerary.getLegs()) {
						List<double[]> decodedPoints = PolylineUtils.decode(leg.getLegGeometry().getPoints());
						combinedPoints.addAll(decodedPoints);  // Combine points
					}
				}

				// Encode combined points into a single polyline
				String combinedPolyline = PolylineUtils.encode(combinedPoints);

				Attendee attendee = attendeeRepository.findByAttendeeUUID((UUID) attendeeMap.get("attendeeUUID"))
					.orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));

				attendee.updateRoute(combinedPolyline);
				attendee.updateDuration(totalDuration);
			}
		}
		room.updateIsCenterExist(true);

		attendeeRepository.saveAll(attendees);
	}

	public List<SubwayInfo> getAroundStation(UUID roomUUID) {
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		String startStation = room.getStartStation();

		if (startStation == null){
			throw new BusinessException(ErrorCode.MIDDLE_NOT_SET_START_LOCATION);
		}

		Map<String, SubwayInfo> subwayMap = subwayDataLoader.getSubwayInfoMap();

		double searchRadius = 5.0; // 5km

		SubwayInfo point = subwayMap.get(startStation);

		List<SubwayInfo> aroundStations = haversineDistance.aroundStation(subwayMap, point.getLatitude(), point.getLongitude(), searchRadius, room.getPurpose());

		if (aroundStations == null || aroundStations.isEmpty()) {
			throw new BusinessException(ErrorCode.MIDDLE_NOT_FOUND_STATION_LOCATION);
		}

		return aroundStations;
	}

	@Transactional
	public RoomMoveRes moveRoom(UUID roomUUID, RoomMoveReq roomMoveReq) {
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		room.updateStartStation(roomMoveReq.getStartStation());

		SubwayInfo selectedStation = subwayDataLoader.getSubwayInfo(roomMoveReq.getStartStation());

		saveOptimalRoutesForUsersInRoomToDatabase(room, selectedStation);

		room.updateStartStation(selectedStation.getName());
		room.updateFinalStation(selectedStation.getName());

		List<Attendee> attendees = attendeeRepository.findAllByRoomId(room.getRoomId());
		List<AttendeeDTO> attendeeList = AttendeeDTO.of(attendees);

		return RoomMoveRes.of(selectedStation, attendeeList);
	}

	@Transactional
	public RoomMiddleRes getMiddleStation(UUID roomUUID) {
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		broadCastService.broadcastToRoom(roomUUID, CenterLoadingDto.of(true), BroadCastType.HOST_FIND_CENTER);
		// Transforming attendees' coordinates into Point instances, skipping null values
		List<Point> points = room.getAttendees().stream()
			.filter(attendee -> attendee.getLat() != null && attendee.getLon() != null)
			.map(attendee -> new Point(attendee.getLat(), attendee.getLon()))
			.collect(Collectors.toList());

		List<Point> grahamPoints = grahamScan.convexHull(points);

		Point centroid = geometryUtils.calculateCentroid(grahamPoints);

		Map<String, SubwayInfo> subwayMap = subwayDataLoader.getSubwayInfoMap();

		double searchRadius = 5.0; // 5km

		if (!room.getPurpose().equals("스터디룸") && !room.getPurpose().equals("식당") && !room.getPurpose().equals("카페") ){
			throw new BusinessException(ErrorCode.MIDDLE_NOT_FOUND_PURPOSE_LOCATION);
		}

		SubwayInfo selectedStation = haversineDistance.selectStation(subwayMap, centroid.getX(),
			centroid.getY(), searchRadius, room.getPurpose());

		if (selectedStation == null) {
			throw new BusinessException(ErrorCode.MIDDLE_NOT_FOUND_STATION_LOCATION);
		}

		saveOptimalRoutesForUsersInRoomToDatabase(room, selectedStation);

		room.updateStartStation(selectedStation.getName());
		room.updateFinalStation(selectedStation.getName());

		List<Attendee> attendees = attendeeRepository.findAllByRoomId(room.getRoomId());
		List<AttendeeDTO> attendeeList = AttendeeDTO.of(attendees);

		RoomMiddleRes res = RoomMiddleRes.of(selectedStation, attendeeList);
		broadCastService.broadcastToRoom(roomUUID, res, BroadCastType.ROOM_CENTER_UPDATE);
		return res;
	}
}
