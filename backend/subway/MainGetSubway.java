import java.util.Map;

public class MainGetSubway {
	public static void main(String[] args) {
		// CSV 파일에서 데이터 읽어서 SubwayMap에 넣기
		Map<String, SubwayInfo> SubwayMap = ParsingSubway.readSubwayInfoFromCSV("subwayinfo.csv");

		// SubwayMap에서 데이터 확인
		String key = "낙성대역";
		RegionType region = RegionType.CAPITAL;
		SubwayInfo subwayInfo = SubwayMap.get(key);

		if (subwayInfo != null && subwayInfo.region == region) {
			System.out.println("Subway found:");
			System.out.println("Name: " + subwayInfo.name);
			System.out.println("Latitude: " + subwayInfo.latitude);
			System.out.println("Longitude: " + subwayInfo.longitude);
			System.out.println("Region: " + subwayInfo.region);
			System.out.println("Subway Lines:");
			for (SubwayLine line : subwayInfo.subwayLines) {
				System.out.println("- " + line.getName());
			}
		} else {
			System.out.println("Subway information not found.");
		}
	}
}
