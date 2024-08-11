package com.maratang.jamjam.domain.room.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.room.dto.response.RoomHistoryRes;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomHistoryService {

	private final RoomRepository roomRepository;

	public List<RoomHistoryRes> getRoomHistory(long memberId) {
		List<Room> list = roomRepository.findByMemberId(memberId);
		return RoomHistoryRes.of(list);
	}

	public RoomHistoryRes getRoomSummary(UUID roomUUID) {
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
		return RoomHistoryRes.of(room);
	}

}
