package com.maratang.jamjam.domain.roundRecord.service;

import com.maratang.jamjam.domain.attendee.dto.AttendeeDTO;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.domain.durationRoute.dto.DurationRouteCreateDTO;
import com.maratang.jamjam.domain.durationRoute.entity.DurationRoute;
import com.maratang.jamjam.domain.durationRoute.mapper.DurationRouteMapper;
import com.maratang.jamjam.domain.durationRoute.repository.DurationRouteRepository;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordCreateRequest;
import com.maratang.jamjam.domain.roundRecord.dto.request.RoundRecordUpdateRequest;
import com.maratang.jamjam.domain.roundRecord.entity.RoundRecord;
import com.maratang.jamjam.domain.roundRecord.mapper.RoundRecordMapper;
import com.maratang.jamjam.domain.roundRecord.repository.RoundRecordRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.middle.PolylineUtils;
import com.maratang.jamjam.global.middle.client.OTPUserClient;
import com.maratang.jamjam.global.middle.dto.OTPUserRes;
import com.maratang.jamjam.global.station.SubwayDataLoader;
import com.maratang.jamjam.global.station.SubwayInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoundRecordService {
    private final RoundRecordRepository roundRecordRepository;
    private final AttendeeRepository attendeeRepository;
    private final OTPUserClient oTPUserClient;
    private final DurationRouteRepository durationRouteRepository;
    private final RoomRepository roomRepository;
    private final SubwayDataLoader subwayDataLoader;

    @Transactional
    public void createRoundRecord(RoundRecordCreateRequest roundRecordCreateRequest) {
        RoundRecord roundRecord = RoundRecordMapper.INSTANCE.roundRecordCreateReqToRoundRecord(roundRecordCreateRequest);

        roundRecordRepository.save(roundRecord);
    }

    @Transactional
    public void updateRoundRecord(UUID roomUUID, RoundRecordUpdateRequest roundRecordUpdateRequest) {
        RoundRecord roundRecord = roundRecordRepository.findById(roundRecordUpdateRequest.getRoundRecordId())
                .orElseThrow(()->new BusinessException(ErrorCode.RR_NOT_FOUND));

        Room room = roomRepository.findByRoomUUID(roomUUID)
                .orElseThrow(()->new BusinessException(ErrorCode.RR_NOT_FOUND));

        roundRecord.updateStationName(roundRecordUpdateRequest.getStationName());

        SubwayInfo selectedStation = subwayDataLoader.getSubwayInfo(roundRecordUpdateRequest.getStationName());

        saveOptimalRoutesForUsersInRoomToDatabase(room, selectedStation, roundRecord);
    }

    private void saveOptimalRoutesForUsersInRoomToDatabase(Room room, SubwayInfo selectedStation, RoundRecord roundRecord) {
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

                DurationRouteCreateDTO durationRouteCreateDTO = DurationRouteCreateDTO.builder()
                        .route(combinedPolyline)
                        .duration(totalDuration)
                        .attendee(attendee)
                        .roundRecord(roundRecord)
                        .build();

                DurationRoute durationRoute = DurationRouteMapper.INSTANCE.durationRouteCreateDTOToDurationRoute(durationRouteCreateDTO);

                durationRouteRepository.save(durationRoute);
            }
        }
    }

}
