package com.maratang.jamjam.global.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.maratang.jamjam.global.ws.StompHandler;
import com.maratang.jamjam.global.ws.UUIDArgumentResolver;
import com.maratang.jamjam.global.ws.WsHandshakeInterceptor;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	private final StompHandler stompHandler;
	private final WsHandshakeInterceptor wsHandshakeInterceptor;

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/sub");
		config.setApplicationDestinationPrefixes("/pub");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry
			.addEndpoint("/ws")
			.setAllowedOriginPatterns("*")
			.withSockJS()
			.setInterceptors(wsHandshakeInterceptor);

		registry
			.addEndpoint("/ws")
			.setAllowedOriginPatterns("*")
			.addInterceptors(wsHandshakeInterceptor);
	}

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.interceptors(stompHandler);
	}

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
		argumentResolvers.add(new UUIDArgumentResolver());
	}
}
