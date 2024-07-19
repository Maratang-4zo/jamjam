import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class Main {
	static Map<String, SubwayInfo> SubwayMap;

	public static void main(String[] args) {
		SubwayMap = new HashMap<>();

		// CSV 파일에서 데이터 읽어서 SubwayMap에 넣기
		readSubwayInfoFromCSV("subwayinfo.csv");

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

	public static void readSubwayInfoFromCSV(String filename) {
		try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(filename),
			StandardCharsets.UTF_8))) {
			String line;
			while ((line = br.readLine()) != null) {
				String[] data = line.split(",", -1); // -1을 설정하여 빈 문자열도 포함시킴
				if (data.length >= 5) {
					String name = data[0].trim();
					Double latitude = parseDoubleOrDefault(data[2].trim(), null);
					Double longitude = parseDoubleOrDefault(data[3].trim(), null);
					RegionType region = parseRegionTypeOrDefault(data[1].trim(), null);
					String lineName = data[4].trim();

					if (name.isEmpty() || latitude == null || longitude == null || region == null
						|| lineName.isEmpty()) {
						System.out.println("name" + name);
						System.out.println("latitude" + latitude);
						System.out.println("longitude" + longitude);
						System.out.println("region" + region);
						System.out.println("lineName" + lineName);
						continue;
					}

					// Check if the subway station already exists in the map
					if (SubwayMap.containsKey(name)) {
						SubwayInfo subwayInfo = SubwayMap.get(name);
						SubwayLine subwayLine = getSubwayLineByName(lineName);
						if (subwayLine != null) {
							subwayInfo.addSubwayLine(subwayLine);
						} else {
							System.out.println("Unknown subway line: " + lineName);
						}
					} else {
						SubwayLine subwayLine = getSubwayLineByName(lineName);
						if (subwayLine != null) {
							SubwayInfo subwayInfo = new SubwayInfo(name, latitude, longitude, region, subwayLine);
							SubwayMap.put(name, subwayInfo);
						} else {
							System.out.println("Unknown subway line: " + lineName);
						}
					}
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static SubwayLine getSubwayLineByName(String lineName) {
		for (SubwayLine line : SubwayLine.values()) {
			if (line.getName().equals(lineName)) {
				return line;
			}
		}
		return null;
	}

	public static Double parseDoubleOrDefault(String s, Double defaultValue) {
		try {
			return Double.parseDouble(s);
		} catch (NumberFormatException | NullPointerException e) {
			return defaultValue;
		}
	}

	public static RegionType parseRegionTypeOrDefault(String s, RegionType defaultValue) {
		try {
			return RegionType.fromKoreanName(s);
		} catch (IllegalArgumentException | NullPointerException e) {
			return defaultValue;
		}
	}
}
