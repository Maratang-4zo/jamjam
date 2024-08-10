package com.maratang.jamjam.backup.board.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class BoardCreateReq {
	@NotBlank
	private String title;
	@NotBlank
	private String content;
}
