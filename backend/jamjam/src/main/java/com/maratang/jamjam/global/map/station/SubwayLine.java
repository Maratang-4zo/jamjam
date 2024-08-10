package com.maratang.jamjam.global.map.station;

public enum SubwayLine {
	LINE_1("01호선"),
	LINE_2("02호선"),
	LINE_3("03호선"),
	LINE_4("04호선"),
	LINE_5("05호선"),
	LINE_6("06호선"),
	LINE_7("07호선"),
	LINE_8("08호선"),
	LINE_9("09호선"),
	GYEONGGANG("경강선"),
	GYEONGUI("경의선"),
	GYEONGCHUN("경춘선"),
	AIRPORT("공항철도"),
	GIMPOGOLD("김포골드"),
	BUNDANG("분당선"),
	SEOHAE("서해선"),
	SUIIN("수인선"),
	SINBUNDANG("신분당선"),
	YONGINGYEONGJEON("용인경전철"),
	UIISHINSEOLGYEONGJEON("우이신설경전철"),
	UIJEONBUGYEONGJEON("의정부경전철"),
	INCHEON("인천선"),
	INCHEON2("인천2호선");

	private final String name;

	SubwayLine(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}
}