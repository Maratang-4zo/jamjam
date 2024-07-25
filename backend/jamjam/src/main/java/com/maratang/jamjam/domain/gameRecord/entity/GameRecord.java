package com.maratang.jamjam.domain.gameRecord.entity;

import com.maratang.jamjam.domain.room.entity.Room;

import jakarta.persistence.*;

@Entity
@Table(name = "game_record")
public class GameRecord {
	@Id
	private Long game_record_id;

	private Integer round_cnt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_id")
	private Room room;

	private String final_station_name;
}

