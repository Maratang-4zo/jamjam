package com.maratang.jamjam.global.station;

import java.io.InputStream;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
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
	private void loadSubwayData() throws Exception {
		Resource resource = new ClassPathResource("data/subwayInfo.csv");
		InputStream inputStream = resource.getInputStream();

		this.subwayMap = stationCSVParsing.readSubwayInfoFromCSV(inputStream);
	}

	public Map<String, SubwayInfo> getSubwayInfoMap() {
		return subwayMap;
	}
}
