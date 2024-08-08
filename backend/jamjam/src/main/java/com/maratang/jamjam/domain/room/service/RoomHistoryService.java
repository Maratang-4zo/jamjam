package com.maratang.jamjam.domain.room.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.room.dto.response.RoomHistoryRes;
import com.maratang.jamjam.domain.room.entity.Room;
import com.maratang.jamjam.domain.room.mapper.RoomMapper;
import com.maratang.jamjam.domain.room.repository.RoomRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomHistoryService {

	private final RoomRepository roomRepository;
	private final RoomMapper roomMapper;

	public List<RoomHistoryRes> getRoomHistory(long memberId) {
		List<Room> list = roomRepository.findByMemberId(memberId);
		List<RoomHistoryRes> resList = roomMapper.INSTANCE.roomsToRoomHistoryResList(list);
		return resList;
	}

	public RoomHistoryRes getRoomSummary(UUID roomUUID) {
		Room room = roomRepository.findByRoomUUID(roomUUID)
			.orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));
		RoomHistoryRes roomHistoryRes = roomMapper.INSTANCE.roomToRoomHistoryRes(room);
		return roomHistoryRes;
	}

}
