package com.maratang.jamjam.global.station;

import java.util.Map;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class SubwayDataLoader {
	private Map<String, SubwayInfo> subwayMap;

	private final StationCSVParsing stationCSVParsing;

	public SubwayDataLoader(StationCSVParsing stationCSVParsing) {
		this.stationCSVParsing = stationCSVParsing;
	}

	@PostConstruct
	private void loadSubwayData(){
		this.subwayMap = stationCSVParsing.readSubwayInfoFromCSV("data/subwayinfo.csv");
	}

	public Map<String, SubwayInfo> getSubwayInfoMap() {
		return subwayMap;
	}
}
