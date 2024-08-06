package com.maratang.jamjam.global.middle.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.maratang.jamjam.global.middle.dto.OTPUserRes;

@FeignClient(url = "${otp.user.client.url}", name = "OTPUserClient")
public interface OTPUserClient {

	@GetMapping(value = "/otp/routers/default/plan", produces = "application/json")
	OTPUserRes getOTPUser(
		@RequestParam("fromPlace") String fromPlace,
		@RequestParam("toPlace") String toPlace,
		@RequestParam("mode") String mode,
		@RequestParam("date") String date,
		@RequestParam("time") String time,
		@RequestParam("numItineraries") String numItineraries
	);

	// Default method with fixed parameters
	default OTPUserRes getFixedOTPUser(String fromPlace, String toPlace) {
		String mode = "TRANSIT,WALK";
		String date = "2024-07-24";
		String time = "08:00am";
		String numItineraries = "1";  // Convert int to String

		return getOTPUser(fromPlace, toPlace, mode, date, time, numItineraries);
	}
}


