package com.maratang.jamjam.domain.localInfo.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.maratang.jamjam.domain.localInfo.dto.response.LocalInfoRes;
import com.maratang.jamjam.domain.localInfo.mapper.LocalInfoMapper;

@Repository
public class LocalInfoRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	public List<LocalInfoRes> selectAllByStationNameAndCategory(String stationName, String category) {

		String sql = "SELECT * FROM local_info WHERE is_deleted = 0 AND station_name = ? AND category = ?";

		return jdbcTemplate.query(
			sql,
			new LocalInfoMapper(),
			stationName,
			category
		);
	}

	public int countAllByStationNameAndCategory(String stationName, String category) {
		String sql = "SELECT COUNT(*) FROM local_info WHERE is_deleted = 0 AND station_name = ? AND category = ?";
		return jdbcTemplate.queryForObject(sql, new Object[] {stationName, category}, Integer.class);
	}
}
