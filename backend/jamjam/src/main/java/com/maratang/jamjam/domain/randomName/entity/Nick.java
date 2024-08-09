package com.maratang.jamjam.domain.randomName.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "nick")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Nick {
	@Id
	@GeneratedValue
	private Long nickId;

	private String nick;

	@Builder
	public Nick(Long nickId, String nick) {
		this.nickId = nickId;
		this.nick = nick;
	}
}
