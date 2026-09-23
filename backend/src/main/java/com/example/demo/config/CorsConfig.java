package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

	 @Bean
	    public CorsConfigurationSource corsConfigurationSource() {

	        CorsConfiguration configuration = new CorsConfiguration();

	        configuration.setAllowedOrigins(
	                List.of("http://localhost:5173"));

	        configuration.setAllowedMethods(
	                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

	        configuration.setAllowedHeaders(
	                List.of("*"));

	        configuration.setAllowCredentials(Boolean.TRUE);
	        
	        UrlBasedCorsConfigurationSource source =
	                new UrlBasedCorsConfigurationSource();

	        source.registerCorsConfiguration("/**", configuration);

	        return source;
	    }
}