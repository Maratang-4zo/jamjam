package com.maratang.jamjam.domain.room.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.commons.security.ResourceServerTokenRelayAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maratang.jamjam.domain.member.entity.Member;
import com.maratang.jamjam.domain.member.repository.MemberRepository;
import com.maratang.jamjam.domain.room.dto.RoomHistoryDTO;
import com.maratang.jamjam.domain.room.dto.response.RoomHistoryRes;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.mapper.RoomMapper;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.auth.oauth.kakao.client.KakaoUserInfoClient;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.AuthenticationException;
import com.maratang.jamjam.global.error.exception.BusinessException;
import com.maratang.jamjam.global.util.DateTimeUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomHistoryService {

	private final RoomRepository roomRepository;
	private final RoomMapper roomMapper;
	private final MemberRepository memberRepository;
	private final KakaoUserInfoClient kakaoUserInfoClient;
	private final DateTimeUtils dateTimeUtils;
	private final ObjectMapper objectMapper;
	private final ResourceServerTokenRelayAutoConfiguration resourceServerTokenRelayAutoConfiguration;

	@Value("${kakao.client.id}")
	private String clientId;
	@Value("${kakao.client.secret}")
	private String clientSecret;

	public List<RoomHistoryRes> getRoomHistory(long memberId) {
		List<Room> list = roomRepository.findByMemberId(memberId);
		log.info(list.get(0).getRoomUUID().toString());
		List<RoomHistoryRes> resList = roomMapper.INSTANCE.roomsToRoomHistoryResList(list);
		return resList;
	}

	public RoomHistoryRes getRoomSummary(UUID roomUUID) {
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
		RoomHistoryRes roomHistoryRes = roomMapper.INSTANCE.roomToRoomHistoryRes(room);
		return roomHistoryRes;
	}

	public String createEventInKakaoCalendar(UUID roomUUID, String email) {
		Member member = memberRepository.findByEmail(email)
			.orElseThrow(() -> new AuthenticationException(ErrorCode.MEMBER_NOT_EXISTS));

		String kakaoAccessToken = member.getKakaoAccessToken();
		RoomHistoryRes roomHistoryRes = getRoomSummary(roomUUID);

		String date = dateTimeUtils.formatMeetingDate(roomHistoryRes.getMeetingDate());

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

		String eventJson;
		try {
			eventJson = objectMapper.writeValueAsString(eventDetails);
		} catch (JsonProcessingException e) {
			throw new BusinessException(ErrorCode.INVALID_JSON);
		}

		try {
			ResponseEntity<Map> response = kakaoUserInfoClient.createKakaoCalendarEvent("Bearer " + kakaoAccessToken, eventJson);
			if (response.getStatusCode() == HttpStatus.OK) {
				return response.getBody().toString();
			} else {
				throw new AuthenticationException(ErrorCode.KAKAO_RESPONSE_ERROR);
			}
		} catch (Exception e) {
			log.info("에러가 뭐길래"+e.getMessage());
			if (e.getMessage().contains("401")) {
				reissueTokens(member);

				kakaoAccessToken = member.getKakaoAccessToken();
				ResponseEntity<Map> response = kakaoUserInfoClient.createKakaoCalendarEvent("Bearer " + kakaoAccessToken, eventJson);
				return response.getBody().toString();
			} else {
				throw new AuthenticationException(ErrorCode.KAKAO_RESPONSE_ERROR);
			}
		}
	}

	private void reissueTokens(Member member) {
		ResponseEntity<Map> response = kakaoUserInfoClient.reissueTokens(
			"refresh_token",clientId,member.getKakaoRefreshToken(),clientSecret);

		log.info("여기까진 나왔니..11");
		if (response.getStatusCode() == HttpStatus.OK) {
			Map<String, Object> responseBody = response.getBody();
			if (responseBody.get("refresh_token") != null) {
				member.updateTokens(responseBody.get("access_token").toString(), responseBody.get("refresh_token").toString());
			} else {
				member.updateTokens(responseBody.get("access_token").toString(), member.getKakaoRefreshToken());
				log.info("여기까진 나왔니...");
			}
		} else {

			throw new AuthenticationException(ErrorCode.KAKAO_RESPONSE_ERROR);
		}
	}

}
