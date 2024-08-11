package com.maratang.jamjam.domain.room.dto.request;

import java.time.LocalDateTime;

import com.maratang.jamjam.domain.room.entity.Room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomCreateReq {
	@NotBlank(message = "목적은 필수 입력 사항입니다.")
	private String purpose;

	@NotNull(message = "미팅 날짜는 필수 입력 사항입니다.")
	private LocalDateTime meetingDate;

	private String nickname;

	public Room toEntity(){
		return Room.builder()
                .purpose(purpose)
                .meetingDate(meetingDate)
                .build();
	}
}
