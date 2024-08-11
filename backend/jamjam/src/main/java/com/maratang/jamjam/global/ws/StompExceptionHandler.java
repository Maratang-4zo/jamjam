package com.maratang.jamjam.global.ws;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.ErrorResponse;
import com.maratang.jamjam.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class StompExceptionHandler extends StompSubProtocolErrorHandler {

	@Override
	public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {
		if(ex instanceof MessageDeliveryException){
			ex = ex.getCause();
		}
		ErrorResponse errorResponse;
		if (ex instanceof BusinessException businessException) {
			errorResponse = ErrorResponse.of(businessException.getErrorCode());
		} else {
			errorResponse = ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR);
		}
		StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.ERROR);
		accessor.setMessage(errorResponse.getMessage());
		accessor.setLeaveMutable(true);

		return MessageBuilder.createMessage(errorResponse.toString().getBytes(), accessor.getMessageHeaders());
	}

	@Override
	public Message<byte[]> handleErrorMessageToClient(Message<byte[]> errorMessage) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(errorMessage);
		ErrorResponse errorResponse = ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR);

		accessor.setMessage(errorResponse.getMessage());
		accessor.setLeaveMutable(true);

		return MessageBuilder.createMessage(errorResponse.toString().getBytes(), accessor.getMessageHeaders());
	}

}

