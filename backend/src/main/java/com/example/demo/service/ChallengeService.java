package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service // Marks this as a business logic service
public class ChallengeService {

    // In-memory store for active challenges: <Challenge ID, Correct Answer>
    private final Map<String, Integer> activeChallenges = new HashMap<>();

    public Challenge generateChallenge() {
        int num1 = (int) (Math.random() * 10) + 5; // 5-14
        int num2 = (int) (Math.random() * 10) + 2; // 2-11
        int answer = num1 * num2;
        String challengeId = UUID.randomUUID().toString();

        activeChallenges.put(challengeId, answer);
        
        // Remove challenge after 5 minutes (to prevent memory leak in real app)
        new Thread(() -> {
            try {
                Thread.sleep(5 * 60 * 1000);
                activeChallenges.remove(challengeId);
            } catch (InterruptedException ignored) {}
        }).start();

        return new Challenge(challengeId, num1, num2);
    }

    public boolean verifyChallenge(String challengeId, int submittedAnswer) {
        Integer correctAnswer = activeChallenges.get(challengeId);
        if (correctAnswer != null && correctAnswer.equals(submittedAnswer)) {
            activeChallenges.remove(challengeId); // Remove immediately after success
            return true;
        }
        return false;
    }

    // Inner class for challenge details
    public static class Challenge {
        public String id;
        public int num1;
        public int num2;
        
        public Challenge(String id, int num1, int num2) {
            this.id = id;
            this.num1 = num1;
            this.num2 = num2;
        }
    }
}