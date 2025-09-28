// package com.example.demo.controller;

// import com.example.demo.model.User;
// import com.example.demo.repository.UserRepository;
// import com.example.demo.service.ChallengeService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import java.util.Optional;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {

//     @Autowired private UserRepository userRepository;
//     @Autowired private ChallengeService challengeService;
//     private Long currentUserId = null; // Mock session state

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
import com.example.demo.service.MockSessionService; // IMPORT THE SHARED SERVICE
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // IMPORT FOR HASHING
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private ChallengeService challengeService;
    @Autowired private MockSessionService sessionService; // INJECT THE SHARED SERVICE
    @Autowired private BCryptPasswordEncoder passwordEncoder; // INJECT THE HASHER

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile() {
        Long currentUserId = sessionService.getCurrentUserId(); // USE THE SHARED SERVICE
        if (currentUserId == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
        return userRepository.findById(currentUserId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username already taken.");
        }
        
        ChallengeService.Challenge challenge = challengeService.generateChallenge();
        
        // Return the challenge ID and puzzle numbers to the client
        return ResponseEntity.ok(Map.of(
            "challengeId", challenge.id,
            "num1", challenge.num1,
            "num2", challenge.num2
        ));
    }

    @PostMapping("/challenge/submit")
    public ResponseEntity<?> submitChallenge(@RequestBody Map<String, Object> submission) {
        String challengeId = (String) submission.get("challengeId");
        int submittedAnswer = (int) submission.get("answer");
        String username = (String) submission.get("username");
        String password = (String) submission.get("password");

        if (challengeService.verifyChallenge(challengeId, submittedAnswer)) {
            User newUser = new User();
            newUser.setUsername(username);
            // CRITICAL SECURITY FIX: Hash the password before saving
            newUser.setPasswordHash(passwordEncoder.encode(password));
            
            userRepository.save(newUser);
            sessionService.setCurrentUserId(newUser.getId()); // USE THE SHARED SERVICE
            
            return ResponseEntity.ok(Map.of("message", "Signup successful", "token", "mock-token"));
        }
        return ResponseEntity.badRequest().body("Challenge failed or expired.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginDetails) {
        Optional<User> userOpt = userRepository.findByUsername(loginDetails.getUsername());
        
        // CRITICAL SECURITY FIX: Use passwordEncoder.matches() for safe comparison
        if (userOpt.isPresent() && passwordEncoder.matches(loginDetails.getPasswordHash(), userOpt.get().getPasswordHash())) {
            sessionService.setCurrentUserId(userOpt.get().getId()); // USE THE SHARED SERVICE
            return ResponseEntity.ok(Map.of("message", "Login successful", "token", "mock-token"));
        }
        return ResponseEntity.status(401).body("Invalid credentials.");
    }

    // NEW: Logout Endpoint
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        sessionService.setCurrentUserId(null); // Clear the user session
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
}