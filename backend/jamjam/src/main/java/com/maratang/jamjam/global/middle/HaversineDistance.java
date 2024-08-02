package com.maratang.jamjam.global.middle;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.maratang.jamjam.global.station.SubwayInfo;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class HaversineDistance {
	// Haversine 공식을 사용하여 두 지점 간의 거리를 계산하는 메소드
	public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
		final int R = 6371; // Radius of the earth in km
		double latDistance = Math.toRadians(lat2 - lat1);
		double lonDistance = Math.toRadians(lon2 - lon1);
		double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
			+ Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
			* Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // Distance in km
	}


	// 주어진 위치로부터 5km 이내의 지하철 역을 찾는 메서드
	public static SubwayInfo findNearbyStations(Map<String, SubwayInfo> subwayMap, double latitude,
		double longitude, double radius, short stationCnt) {

		SubwayInfo nearestStation = null;
		double closestDistance = radius; // 초기에는 주어진 반경 내의 최대 거리로 설정

		for (SubwayInfo info : subwayMap.values()) {
			double distance = calculateDistance(latitude, longitude, info.getLatitude(), info.getLongitude());
			if (distance <= radius && distance < closestDistance) {
				nearestStation = info;
				closestDistance = distance; // 업데이트된 가장 가까운 거리
			}
		}

		return nearestStation;
	}
}
