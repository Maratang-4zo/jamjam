package com.maratang.jamjam.domain.room.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoomUpdateReq {
	@NotBlank(message = "방 날짜는 필수 입력 사항입니다.")
	private LocalDateTime meetingDay;
	@NotBlank(message = "방이름은 필수 입력 사항입니다.")
	private String name;
	@NotBlank(message = "목적은 필수 입력 사항입니다.")
	private String purpose;
}
