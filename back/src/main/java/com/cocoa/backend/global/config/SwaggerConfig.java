package com.cocoa.backend.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(apiInfo());

    }

    private Info apiInfo() {
        return new Info()
                .title("COCOA REST API")
                .description("COCOA REST API")
                .version("1.0.0")
                .license(new License().name("COCOA 서비스 링크").url("https://j12a507.p.ssafy.io/"));
    }
}
