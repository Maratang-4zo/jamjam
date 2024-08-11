package com.maratang.jamjam.global.ws;

import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;

import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.ErrorResponse;
import com.maratang.jamjam.global.error.exception.BusinessException;

@ControllerAdvice
public class GlobalMessageExceptionHandler {
	@MessageExceptionHandler
	@SendToUser(destinations = "/sub/errors")
	public ErrorResponse handleException(Throwable e) {
		Throwable cause = e;
		if(e instanceof MessageDeliveryException){
			cause = e.getCause();
		}
		if(cause instanceof BusinessException businessException){
			return ErrorResponse.of(businessException.getErrorCode());
		}

		return ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR);
	}
}
