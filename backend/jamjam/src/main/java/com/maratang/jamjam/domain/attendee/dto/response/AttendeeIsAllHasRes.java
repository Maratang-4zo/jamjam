package com.maratang.jamjam.domain.attendee.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AttendeeIsAllHasRes {

	@JsonProperty("isAllHasDeparture")
	private final boolean isAllHasDeparture;

	@JsonProperty("isCenterExist")
	private final boolean isCenterExist;

	@JsonIgnore
	private boolean getAllHasDeparture() {
		return isAllHasDeparture;
	}

	@JsonIgnore
	private boolean getCenterExist() {
		return isCenterExist;
	}
}
