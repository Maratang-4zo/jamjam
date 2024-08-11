package com.maratang.jamjam.domain.room.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.maratang.jamjam.domain.room.dto.response.RoomHistoryRes;
import com.maratang.jamjam.domain.room.service.RoomHistoryService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/summary")
@RequiredArgsConstructor
public class RoomSummaryController {

	private final RoomHistoryService roomHistoryService;

	@GetMapping("/{roomUUID}")
	@Operation(summary = "초대장 생성을 위한 방 정보 api", description = "해당 방의 최종 정보를 가져온다.")
	public ResponseEntity<?> getRoomSummary(@PathVariable UUID roomUUID){
		RoomHistoryRes roomHistoryRes = roomHistoryService.getRoomSummary(roomUUID);
		return ResponseEntity.status(HttpStatus.OK).body(roomHistoryRes);
	}

	@GetMapping("/kakaoCalendar/{roomUUID}")
	@Operation(summary = "카카오톡 캘린더에 일정 생성", description = "카카오톡 일정에 추가해준다.")
	public ResponseEntity<?> getRoomKakaoCalendar(@PathVariable UUID roomUUID, HttpServletRequest request) {
		String email = request.getAttribute("email").toString();
		String event_id = roomHistoryService.createEventInKakaoCalendar(roomUUID, email);
		return ResponseEntity.status(HttpStatus.OK).body(event_id);
	}

}

// @GetMapping("/kakaoCalendar/{roomUUID}")
// @Operation(summary = "카카오톡 캘린더에 일정 생성", description = "카카오톡 일정에 추가해준다.")
// public ResponseEntity<?> getRoomKakaoCalendar(@PathVariable UUID roomUUID, HttpServletRequest request){
// 	Member member = memberRepository.findByEmail(request.getAttribute("email").toString())
// 		.orElseThrow(()-> new AuthenticationException(ErrorCode.MEMBER_NOT_EXISTS));
//
// 	String kakaoAccessToken = member.getKakaoAccessToken();
//
// 	return null;
// }

/*
@GetMapping("/kakaoCalendar/{roomUUID}")
	@Operation(summary = "카카오톡 캘린더에 일정 생성", description = "카카오톡 일정에 추가해준다.")
	public ResponseEntity<?> getRoomKakaoCalendar(@PathVariable UUID roomUUID, HttpServletRequest request) {
		Member member = memberRepository.findByEmail(request.getAttribute("email").toString())
			.orElseThrow(() -> new AuthenticationException(ErrorCode.MEMBER_NOT_EXISTS));

		String kakaoAccessToken = member.getKakaoAccessToken();
		String calendarUrl = "https://kapi.kakao.com/v2/api/calendar/create/event";

		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(kakaoAccessToken);
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		RoomHistoryRes roomHistoryRes = roomHistoryService.getRoomSummary(roomUUID);
		String date = formatMeetingDate(roomHistoryRes.getMeetingDate());

		RoomHistoryDTO eventDetails = RoomHistoryDTO.builder()
			.title(roomHistoryRes.getName())
			.description(roomHistoryRes.getPurpose())
			.time(RoomHistoryDTO.Time.builder()
				.startAt(date)
				.endAt(date)
				.allDay(true)
				.build())
			.location(RoomHistoryDTO.Location.builder()
				.name(roomHistoryRes.getFinalStation())
				.build())
			.build();

		// EventDetails 객체를 JSON 문자열로 변환
		ObjectMapper objectMapper = new ObjectMapper();
		String eventJson;
		try {
			eventJson = objectMapper.writeValueAsString(eventDetails);
		} catch (JsonProcessingException e) {
			throw new BusinessException(ErrorCode.INVALID_JSON);
		}

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("event", eventJson);

		HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);

		try {
			ResponseEntity<Map> response = restTemplate.postForEntity(calendarUrl, requestEntity, Map.class);
			if (response.getStatusCode() == HttpStatus.OK) {
				// 일정 생성 성공 시 처리 로직
				return ResponseEntity.status(HttpStatus.OK).body(response.getBody());
			} else {
				throw new AuthenticationException(ErrorCode.KAKAO_RESPONSE_ERROR);
			}
		} catch (Exception e) {
			// 토큰 만료 시 재발급 받고 재시도
			if (e.getMessage().contains("401")) { // 401 Unauthorized
				getReissueTokens(member.getEmail());

				// 재발급된 토큰으로 다시 요청
				kakaoAccessToken = memberRepository.findByEmail(member.getEmail())
					.orElseThrow(() -> new AuthenticationException(ErrorCode.MEMBER_NOT_EXISTS))
					.getKakaoAccessToken();
				headers.setBearerAuth(kakaoAccessToken);

				requestEntity = new HttpEntity<>(params, headers);

				try {
					ResponseEntity<Map> retryResponse = restTemplate.postForEntity(calendarUrl, requestEntity, Map.class);
					if (retryResponse.getStatusCode() == HttpStatus.OK) {
						// 일정 생성 성공 시 처리 로직
						return ResponseEntity.status(HttpStatus.OK).body(retryResponse.getBody());
					} else {
						throw new AuthenticationException(ErrorCode.KAKAO_RESPONSE_ERROR);
					}
				} catch (Exception retryException) {
					throw new AuthenticationException(ErrorCode.KAKAO_RESPONSE_ERROR);
				}
			} else {
				throw new AuthenticationException(ErrorCode.KAKAO_RESPONSE_ERROR);
			}
		}
	}

	private String formatMeetingDate(LocalDateTime meetingDate) {
		// 원하는 형식을 위한 DateTimeFormatter
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'00:00:00'Z'");
		return meetingDate.format(formatter);
	}

	private void getReissueTokens(String email) {

		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_EXISTS));

		String tokenUrl = "https://kauth.kakao.com/oauth/token";

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "refresh_token");
		params.add("client_id", clientId);
		params.add("refresh_token", member.getKakaoRefreshToken());
		params.add("client_secret", clientSecret);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
		try {
			ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
			if (response.getStatusCode() == HttpStatus.OK) {
				Map<String, Object> responseBody = response.getBody();
				if(responseBody.get("refresh_token") != null){
					member.updateTokens(responseBody.get("access_token").toString(), responseBody.get("refresh_token").toString());
				}else{
					member.updateTokens(responseBody.get("access_token").toString(), member.getKakaoRefreshToken());
				}
			} else {
				throw new AuthenticationException(ErrorCode.KAKAO_RESPONSE_ERROR);
			}
		} catch (Exception e) {
			throw new AuthenticationException(ErrorCode.KAKAO_RESPONSE_ERROR);
		}
	}
 */
