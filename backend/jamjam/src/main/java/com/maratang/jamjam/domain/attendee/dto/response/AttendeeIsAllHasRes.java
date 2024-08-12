package com.maratang.jamjam.domain.attendee.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AttendeeIsAllHasRes {
	boolean isAllHasRes;
	boolean isCenterExist;
}
