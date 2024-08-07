package com.maratang.jamjam.domain.localInfo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.maratang.jamjam.domain.localInfo.dto.response.LocalInfoRes;
import com.maratang.jamjam.domain.localInfo.repository.LocalInfoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocalInfoService {
	private final LocalInfoRepository localInfoRepository;

	// @Cacheable(value = "LOCAL_INFO_CACHE", key = "#stationName + '-' + #category", cacheManager = "cacheManager")
	public List<LocalInfoRes> getLocalInfoList(String stationName, String category) {
		return localInfoRepository.selectAllByStationNameAndCategory(stationName, category);
	}
}
