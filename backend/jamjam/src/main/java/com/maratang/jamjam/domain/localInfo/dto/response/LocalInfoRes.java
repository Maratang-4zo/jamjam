package com.maratang.jamjam.domain.localInfo.dto.response;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LocalInfoRes {
	private String name;
	private String category;
	private String roadAddress;
	private String address;
	private String phone;
	private Float latitude;
	private Float longitude;
	private LocalDateTime updatedAt;

}
