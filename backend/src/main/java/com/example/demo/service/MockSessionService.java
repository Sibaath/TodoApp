package com.example.demo.service;

import org.springframework.stereotype.Service;

@Service // Essential for Spring to create a single, shared instance
public class MockSessionService {
    
    private Long currentUserId = null; // Global state for the logged-in user

    public Long getCurrentUserId() {
        return currentUserId;
    }

    public void setCurrentUserId(Long userId) {
        this.currentUserId = userId;
    }
}