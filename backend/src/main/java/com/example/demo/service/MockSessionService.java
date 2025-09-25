package com.example.demo.service;

import org.springframework.stereotype.Service;

@Service // Makes this a Singleton, accessible globally
public class MockSessionService {
    
    // This value will now persist across all HTTP requests
    private Long currentUserId = null; 

    public Long getCurrentUserId() {
        return currentUserId;
    }

    public void setCurrentUserId(Long userId) {
        this.currentUserId = userId; // Set during successful login/signup
    }
}
