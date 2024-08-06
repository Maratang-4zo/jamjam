package com.maratang.jamjam.global.middle;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.maratang.jamjam.domain.localInfo.repository.LocalInfoRepository;
import com.maratang.jamjam.global.station.SubwayInfo;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class HaversineDistance {

	private final LocalInfoRepository localInfoRepository;

	// Haversine 공식을 사용하여 두 지점 간의 거리를 계산하는 메소드
	public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
		final int R = 6371; // Radius of the earth in km
		double latDistance = Math.toRadians(lat2 - lat1);
		double lonDistance = Math.toRadians(lon2 - lon1);
		double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
			+ Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
			* Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // Distance in km
	}

	// 주어진 위치로부터 5km 이내의 지하철 역들 중 모임 목적에 맞는 역을 찾는 메서드
	public SubwayInfo selectStation(Map<String, SubwayInfo> subwayMap, double latitude,
		double longitude, double radius, String purpose) {

		SubwayInfo selectedStation = null;
		int maxCount = -1; // 스터디룸(모임목적)이 가장 많은 역의 스터디룸 개수

		for (SubwayInfo info : subwayMap.values()) {
			double distance = calculateDistance(latitude, longitude, info.getLatitude(), info.getLongitude());
			if (distance > radius) {
				continue;
			}
			int count = localInfoRepository.countAllByStationNameAndCategory(info.getName(), purpose);
			if (count > maxCount) {
				selectedStation = info;
				maxCount = count;
			}
		}

		return selectedStation;
	}
}
