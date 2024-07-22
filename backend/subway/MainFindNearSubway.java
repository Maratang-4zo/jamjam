import java.util.Map;

public class MainFindNearSubway {
	public static void main(String[] args) {
		// CSV 파일에서 데이터 읽어서 SubwayMap에 넣기
		Map<String, SubwayInfo> SubwayMap = ParsingSubway.readSubwayInfoFromCSV("subwayinfo.csv");

		// 위도와 경도를 기준으로 반경 2km 내의 지하철 역 찾기 낙성대
		double inputLatitude = 37.47708963;
		double inputLongitude = 126.9635058;
		double radius = 2.0; // 2km

		System.out.println("Subways within 2km:");
		for (SubwayInfo subwayInfo : SubwayMap.values()) {
			double distance = HaversineDistance.calculateDistance(inputLatitude, inputLongitude, subwayInfo.latitude,
				subwayInfo.longitude);
			if (distance <= radius) {
				System.out.println("Name: " + subwayInfo.name);
				System.out.println("Latitude: " + subwayInfo.latitude);
				System.out.println("Longitude: " + subwayInfo.longitude);
				System.out.println("Region: " + subwayInfo.region);
				System.out.println("Subway Lines:");
				for (SubwayLine line : subwayInfo.subwayLines) {
					System.out.println("- " + line.getName());
				}
			}
		}
	}
}
