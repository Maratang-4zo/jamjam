package com.maratang.jamjam.domain.localInfo.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.maratang.jamjam.domain.localInfo.dto.response.LocalInfoRes;

public class LocalInfoMapper implements RowMapper<LocalInfoRes> {
	@Override
	public LocalInfoRes mapRow(ResultSet rs, int rowNum) throws SQLException {
		LocalInfoRes localInfo = new LocalInfoRes();
		localInfo.setName(rs.getString("name"));
		localInfo.setCategory(rs.getString("category"));
		localInfo.setRoadAddress(rs.getString("road_address"));
		localInfo.setAddress(rs.getString("address"));
		localInfo.setPhone(rs.getString("phone"));
		localInfo.setLatitude(rs.getFloat("latitude"));
		localInfo.setLongitude(rs.getFloat("longitude"));
		localInfo.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
		return localInfo;
	}
}
