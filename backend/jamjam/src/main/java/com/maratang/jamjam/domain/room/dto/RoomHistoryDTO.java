package com.maratang.jamjam.domain.room.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomHistoryDTO {

	public String title;
	public Time time;
	public String description;
	public Location location;

	// Time 클래스 정의
	@Builder
	public static class Time {
		public String startAt; // "yyyy-MM-dd'T'HH:mm:ss'Z'" 형식
		public String endAt;
		public boolean allDay;
	}

	// Location 클래스 정의
	@Builder
	public static class Location {
		public String name;
	}



}
