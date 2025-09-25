// package com.example.demo.controller;

// import com.example.demo.model.User;
// import com.example.demo.repository.UserRepository;
// import com.example.demo.service.ChallengeService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import java.util.Optional;
// import java.util.Map;

// // MOCK SECURITY: For simplicity, we use an in-memory "session"
// // In a real app, this would use Spring Security's session or JWT.
// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {

//     @Autowired private UserRepository userRepository;
//     @Autowired private ChallengeService challengeService;
//     Long currentUserId = null; // Mock session state

//     @GetMapping("/profile")
//     public ResponseEntity<User> getUserProfile() {
//         if (currentUserId == null) {
//             return ResponseEntity.status(401).build(); // Unauthorized
//         }
//         return userRepository.findById(currentUserId)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // POST: /api/auth/signup - Start signup and get the initial challenge
//     @PostMapping("/signup")
//     public ResponseEntity<?> signup(@RequestBody User user) {
//         if (userRepository.findByUsername(user.getUsername()).isPresent()) {
//             return ResponseEntity.badRequest().body("Username already taken.");
//         }
        
//         ChallengeService.Challenge challenge = challengeService.generateChallenge();
        
//         // Return the challenge ID and puzzle numbers to the client
//         return ResponseEntity.ok(Map.of(
//             "challengeId", challenge.id,
//             "num1", challenge.num1,
//             "num2", challenge.num2
//         ));
//     }

//     // POST: /api/auth/challenge/submit - Verify bot check and finalize registration
//     @PostMapping("/challenge/submit")
//     public ResponseEntity<?> submitChallenge(@RequestBody Map<String, Object> submission) {
//         String challengeId = (String) submission.get("challengeId");
//         int submittedAnswer = (int) submission.get("answer");
//         String username = (String) submission.get("username");
//         String password = (String) submission.get("password");

//         if (challengeService.verifyChallenge(challengeId, submittedAnswer)) {
//             // Successfully verified: Finalize user registration
//             User newUser = new User();
//             newUser.setUsername(username);
//             // In a real app, hash the password (e.g., using BCrypt)
//             newUser.setPasswordHash(password); 
            
//             userRepository.save(newUser);
//             currentUserId = newUser.getId(); // Mock login after signup
            
//             return ResponseEntity.ok(Map.of("message", "Signup successful", "token", "mock-token"));
//         }
//         return ResponseEntity.badRequest().body("Challenge failed or expired.");
//     }

//     // POST: /api/auth/login - Mock Login
//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody User loginDetails) {
//         Optional<User> userOpt = userRepository.findByUsername(loginDetails.getUsername());
        
//         if (userOpt.isPresent() && userOpt.get().getPasswordHash().equals(loginDetails.getPasswordHash())) {
//             currentUserId = userOpt.get().getId(); // Mock login success
//             return ResponseEntity.ok(Map.of("message", "Login successful", "token", "mock-token"));
//         }
//         return ResponseEntity.status(401).body("Invalid credentials.");
//     }
// }


package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ChallengeService;
import com.example.demo.service.MockSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private ChallengeService challengeService;
    @Autowired private MockSessionService sessionService; // Inject the session service

    // ------------------------------------------------------------------
    // GET: /api/auth/profile (Check current user)
    // ------------------------------------------------------------------
    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile() {
        Long currentUserId = sessionService.getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
        return userRepository.findById(currentUserId)
                .map(user -> {
                    // Censor the password hash before sending to client
                    user.setPasswordHash(null); 
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ------------------------------------------------------------------
    // POST: /api/auth/signup (Start signup and generate challenge)
    // ------------------------------------------------------------------
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already taken.");
        }
        
        ChallengeService.Challenge challenge = challengeService.generateChallenge();
        
        // Return the challenge ID and puzzle numbers
        return ResponseEntity.ok(Map.of(
            "challengeId", challenge.id,
            "num1", challenge.num1,
            "num2", challenge.num2
        ));
    }

    // ------------------------------------------------------------------
    // POST: /api/auth/challenge/submit (Verify challenge and finalize registration)
    // ------------------------------------------------------------------
    @PostMapping("/challenge/submit")
    public ResponseEntity<?> submitChallenge(@RequestBody Map<String, Object> submission) {
        String challengeId = (String) submission.get("challengeId");
        // Submission logic assumes 'answer', 'username', and 'password' are provided
        Integer submittedAnswer = (Integer) submission.get("answer");
        String username = (String) submission.get("username");
        String password = (String) submission.get("password");

        if (challengeService.verifyChallenge(challengeId, submittedAnswer)) {
            // Successfully verified: Finalize user registration
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPasswordHash(password); // WARNING: Use BCrypt in production
            
            User savedUser = userRepository.save(newUser);
            sessionService.setCurrentUserId(savedUser.getId()); // LOGS USER IN
            
            return ResponseEntity.ok(Map.of("message", "Signup successful", "token", "mock-token"));
        }
        return ResponseEntity.badRequest().body("Challenge failed or expired.");
    }

    // ------------------------------------------------------------------
    // POST: /api/auth/login (Mock Login)
    // ------------------------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginDetails) {
        Optional<User> userOpt = userRepository.findByUsername(loginDetails.getUsername());
        
        if (userOpt.isPresent() && userOpt.get().getPasswordHash().equals(loginDetails.getPasswordHash())) {
            sessionService.setCurrentUserId(userOpt.get().getId()); // LOGS USER IN
            return ResponseEntity.ok(Map.of("message", "Login successful", "token", "mock-token"));
        }
        
        // Clear session on failure
        sessionService.setCurrentUserId(null); 
        return ResponseEntity.status(401).body("Invalid credentials.");
    }
}