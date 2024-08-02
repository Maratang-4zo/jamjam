package com.maratang.jamjam.global.ws;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.ChannelInterceptor;

@Configuration
public class StompHandler implements ChannelInterceptor {

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		/*
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

		if(StompCommand.CONNECT.equals(accessor.getCommand())){

		} else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())){

		}
		 */
		return message;
	}
}
