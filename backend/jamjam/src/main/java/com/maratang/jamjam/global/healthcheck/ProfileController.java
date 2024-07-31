package com.maratang.jamjam.global.healthcheck;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProfileController {

	@GetMapping("/check")
	public String checkServerStatus() {
		return "check";
	}
}
