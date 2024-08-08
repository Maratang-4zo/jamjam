package com.maratang.jamjam.global.ws;

import java.util.Map;
import java.util.UUID;

import org.springframework.core.MethodParameter;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;

import com.maratang.jamjam.global.error.ErrorCode;
import com.maratang.jamjam.global.error.exception.BusinessException;

public class UUIDArgumentResolver implements HandlerMethodArgumentResolver {

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return UUID.class.isAssignableFrom(parameter.getParameterType()) && !parameter.hasParameterAnnotations();
	}

	@Override
	public Object resolveArgument(MethodParameter parameter, Message<?> message) throws Exception {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
		Map<String, Object> attr = accessor.getSessionAttributes();
		String parameterName = parameter.getParameterName();

		assert attr != null;
		if(attr.get(parameterName)!=null){
			return attr.get(parameterName);
		}

		throw new BusinessException(ErrorCode.BAD_REQUEST);
	}
}