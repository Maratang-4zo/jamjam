package com.maratang.jamjam.domain.localInfo.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.maratang.jamjam.domain.localInfo.dto.response.LocalInfoRes;

public class LocalInfoMapper implements RowMapper<LocalInfoRes> {
	@Override
	public LocalInfoRes mapRow(ResultSet rs, int rowNum) throws SQLException {
		return LocalInfoRes.builder()
			.name(rs.getString("name"))
			.category(rs.getString("category"))
			.roadAddress(rs.getString("road_address"))
			.address(rs.getString("address"))
			.phone(rs.getString("phone"))
			.latitude(rs.getFloat("latitude"))
			.longitude(rs.getFloat("longitude"))
			.updatedAt(rs.getTimestamp("updated_at").toLocalDateTime())
			.build();
	}
}
