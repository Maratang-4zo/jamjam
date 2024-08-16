package com.maratang.jamjam.domain.room.dto.response;

import java.util.List;

import com.maratang.jamjam.domain.localInfo.dto.response.LocalInfoRes;
import com.maratang.jamjam.global.map.station.RegionType;
import com.maratang.jamjam.global.map.station.SubwayInfo;
import com.maratang.jamjam.global.map.station.SubwayLine;

import lombok.Getter;

@Getter
public class SubwayLocalInfo {
	String name;
	Double latitude;
	Double longitude;
	RegionType region;
	List<SubwayLine> subwayLines;
	List<LocalInfoRes> stores;

	public SubwayLocalInfo(SubwayInfo info, List<LocalInfoRes> stores) {
		this.name = info.getName();
		this.latitude = info.getLatitude();
		this.longitude = info.getLongitude();
		this.region = info.getRegion();
		this.subwayLines = info.getSubwayLines();
		this.stores = stores;
	}

	public void addSubwayLine(SubwayLine subwayLine) {
		this.subwayLines.add(subwayLine);
	}

	public void setName(String name) {
		this.name = name;
	}
}
