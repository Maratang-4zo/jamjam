package com.maratang.jamjam.domain.attendee.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.maratang.jamjam.domain.attendee.dto.request.AttendeeCreateReq;
import com.maratang.jamjam.domain.attendee.dto.request.AttendeeUpdateReq;
import com.maratang.jamjam.domain.attendee.entity.Attendee;
import com.maratang.jamjam.domain.attendee.mapper.AttendeeMapper;
import com.maratang.jamjam.domain.attendee.repository.AttendeeRepository;
import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendeeService {
	private final AttendeeRepository attendeeRepository;

	@Transactional
	public Attendee createAttendee(AttendeeCreateReq attendeeCreateReq) {
		Attendee attendee = AttendeeMapper.INSTANCE.attendeeCreateReqToAttendee(attendeeCreateReq);
		attendeeRepository.save(attendee);

		return attendee;
	}

	@Transactional
	public void updateAttendee(AttendeeUpdateReq attendeeUpdateReq) {
		Attendee attendee = attendeeRepository.findById(attendeeUpdateReq.getAttendeeId())
			.orElseThrow(()->new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND));

		attendee.updateAttendeeLocation(attendeeUpdateReq);
	}
}
