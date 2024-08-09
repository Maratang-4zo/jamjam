package com.maratang.jamjam.backup.board.entity;

import com.maratang.jamjam.global.auditing.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Board extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(columnDefinition = "INT UNSIGNED")
	private Long boardId;

	@Column(nullable = false, length = 50)
	private String title;
	@Column(nullable = false)
	private String content;
	private String author;

	@Builder
	public Board(String title, String content, String author) {
		this.title = title;
		this.content = content;
		this.author = author;
	}

}
