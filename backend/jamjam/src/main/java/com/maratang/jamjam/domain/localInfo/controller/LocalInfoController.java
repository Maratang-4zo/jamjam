package com.maratang.jamjam.domain.localInfo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.localInfo.dto.response.LocalInfoRes;
import com.maratang.jamjam.domain.localInfo.service.LocalInfoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/local-info")
@RequiredArgsConstructor
public class LocalInfoController {
	private final LocalInfoService localInfoService;

	@GetMapping()
	public ResponseEntity<?> getLocalInfoList(@RequestParam String stationName, @RequestParam String category) {
		List<LocalInfoRes> localInfoList = localInfoService.getLocalInfoList(stationName, category);
		return ResponseEntity.status(HttpStatus.OK).body(localInfoList);
	}
}
