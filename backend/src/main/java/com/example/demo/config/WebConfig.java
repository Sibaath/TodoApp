package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Apply this configuration to all API routes
            // IMPORTANT: Change this to the exact URL of your React app
            .allowedOrigins("http://localhost:5173") 
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
            .allowedHeaders("*") // Allowed headers
            .allowCredentials(true); // Allow sending credentials (like cookies)
    }
}