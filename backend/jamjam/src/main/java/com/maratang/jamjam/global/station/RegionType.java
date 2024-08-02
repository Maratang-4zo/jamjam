package com.maratang.jamjam.global.station;

public enum RegionType {
	CAPITAL("수도권"),
	BUSAN("부산"),
	DAEGU("대구"),
	GWANGJU("광주"),
	DAEJEON("대전");

	private final String koreanName;

	RegionType(String koreanName) {
		this.koreanName = koreanName;
	}

	public String getKoreanName() {
		return koreanName;
	}

	public static RegionType fromKoreanName(String koreanName) {
		for (RegionType region : values()) {
			if (region.koreanName.equals(koreanName)) {
				return region;
			}
		}
		throw new IllegalArgumentException("Unknown region name: " + koreanName);
	}
}
