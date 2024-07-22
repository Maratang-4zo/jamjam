import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MainGrahanScan {
	public static void main(String[] args) {
		// CSV 파일에서 데이터 읽어서 SubwayMap에 넣기
		Map<String, SubwayInfo> subwayMap = ParsingSubway.readSubwayInfoFromCSV("subwayinfo.csv");

		// 지하철 역 리스트
		List<String> subwayStationList = List.of("낙성대역", "방배역", "구반포역", "이수역");

		// 해당 역들의 위도와 경도를 Point 리스트로 변환
		List<Point> points = new ArrayList<>();
		for (String station : subwayStationList) {
			SubwayInfo info = subwayMap.get(station);
			if (info != null) {
				points.add(new Point(info.longitude, info.latitude));
			}
		}

		// 그라함 스캔을 사용하여 볼록 껍질 구하기
		List<Point> convexHull = GrahamScan.convexHull(points);

		// 결과 출력
		System.out.println("Convex Hull Points:");
		for (Point p : convexHull) {
			System.out.println(p);
		}

		// 볼록 껍질의 무게중심 계산
		Point centroid = GeometryUtils.calculateCentroid(convexHull);
		System.out.println("Centroid of Convex Hull:");
		System.out.println(centroid);

		// 특정 위치로부터 5km 이내의 지하철 역 찾기
		double searchLatitude = centroid.y;
		double searchLongitude = centroid.x;
		double searchRadius = 2.0; // 5km

		List<SubwayInfo> nearbyStations = HaversineDistance.findNearbyStations(subwayMap, searchLatitude,
			searchLongitude, searchRadius);

		// 결과 출력
		System.out.println("Nearby Stations within 5km:");
		for (SubwayInfo station : nearbyStations) {
			double distance = HaversineDistance.calculateDistance(searchLatitude, searchLongitude, station.latitude,
				station.longitude);
			System.out.println(station.name + " - Distance: " + distance + " km");
		}
	}
}
