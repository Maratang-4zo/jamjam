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
@Table(name = "name")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Name {
	@Id
	@GeneratedValue
	private Long nickId;

	private String name;

	@Builder
	public Name(Long nickId, String name) {
		this.nickId = nickId;
		this.name = name;
	}
}
