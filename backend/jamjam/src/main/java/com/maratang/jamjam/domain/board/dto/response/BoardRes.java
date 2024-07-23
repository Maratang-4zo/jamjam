package com.maratang.jamjam.domain.board.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardRes {
	private long boardId;
	private String title;
	private String content;
	private String author;
}
