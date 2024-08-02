package com.maratang.jamjam.global.station;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;

@Getter
public class SubwayInfo {
	// Getters and setters (if needed)
	String name;
	Double latitude;
	Double longitude;
	RegionType region;
	List<SubwayLine> subwayLines;

	public SubwayInfo(String name, Double latitude, Double longitude, RegionType region, SubwayLine subwayLine) {
		this.name = name;
		this.latitude = latitude;
		this.longitude = longitude;
		this.region = region;
		this.subwayLines = new ArrayList<>();
		this.subwayLines.add(subwayLine);
	}

	public void addSubwayLine(SubwayLine subwayLine) {
		this.subwayLines.add(subwayLine);
	}

	public void setName(String name) {
		this.name = name;
	}
}

