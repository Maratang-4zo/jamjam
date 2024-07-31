package com.maratang.jamjam.global.healthcheck;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;

@RestController
public class ProfileController {

	@GetMapping("/check")
	@Operation(summary = "🚗 구현 중")
	public String checkServerStatus() {
		return "check";
	}
}
