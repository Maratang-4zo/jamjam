package com.maratang.jamjam.domain.room.dto.request;

import lombok.Getter;

@Getter
public class RoomMoveReq {
	private String startStation; // 여기를 finalStation으로 바꾸고 col값에 finalStation 정보를 받는게 더 효율적일거같아요
}
