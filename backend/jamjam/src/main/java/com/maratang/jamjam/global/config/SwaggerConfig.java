package com.maratang.jamjam.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI openAPI() {
		Info info = new Info()
			.version("v1.0.0")
			.title("API")
			.description("");

		String jwt = "JWT";
		SecurityRequirement securityRequirement = new SecurityRequirement().addList(jwt); // 헤더에 토큰 포함
		Components components = new Components().addSecuritySchemes(jwt, new SecurityScheme()
			.name(jwt)
			.type(SecurityScheme.Type.HTTP)
			.scheme("bearer")
			.bearerFormat("JWT")
		);

		// Server configurations
		Server localServer = new Server();
		localServer.setDescription("local");
		localServer.setUrl("http://localhost:8080/api");

		Server testServer = new Server();
		testServer.setDescription("test");
		testServer.setUrl("https://jjam.shop/api");

		return new OpenAPI()
			.info(info)
			.addSecurityItem(securityRequirement)
			.components(components)
			.addServersItem(localServer)
			.addServersItem(testServer);
	}

}
