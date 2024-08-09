package com.maratang.jamjam.domain.roundRecord.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.roundRecord.entity.RoundRecord;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoundRecordDTO {

	private Integer round;
	private Attendee WinnerAttendee;
	private String stationName;

	public static RoundRecordDTO of(RoundRecord roundRecord) {
		return new RoundRecordDTO(
			roundRecord.getRound(),
			roundRecord.getWinnderAttendee(),
			roundRecord.getStationName()
		);
	}

	public static List<RoundRecordDTO> of(List<RoundRecord> roundRecords) {
		return roundRecords.stream()
			.map(RoundRecordDTO::of)
			.collect(Collectors.toList());
	}
}
