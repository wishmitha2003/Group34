package com.example.BGF.controller;

import com.example.BGF.models.User;
import com.example.BGF.security.JwtUtil;
import com.example.BGF.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public ApiController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User registeredUser = userService.register(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", registeredUser.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        return userService.findByUsername(user.getUsername())
                .map(found -> {
                    if (userService.validatePassword(user.getPassword(), found.getPassword())) {
                        // Check if user is active
                        if (!found.isActive()) {
                            return ResponseEntity.badRequest().body("Account is deactivated");
                        }
                        String token = jwtUtil.generateToken(found.getUsername(), found.getRole());

                        Map<String, Object> response = new HashMap<>();
                        response.put("token", token);
                        response.put("user", Map.of(
                                "id", found.getId(),
                                "username", found.getUsername(),
                                "email", found.getEmail(),
                                "fullName", found.getFullName(),
                                "role", found.getRole(),
                                "active", found.isActive(),
                                "available", found.isAvailable(),
                                "address", found.getAddress(),
                                "phone", found.getPhone()
                        ));
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.badRequest().body("Invalid credentials");
                    }
                })
                .orElse(ResponseEntity.badRequest().body("User not found"));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        try {
            User user = userService.getUserProfile(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Return user data without password
            Map<String, Object> userProfile = new HashMap<>();
            userProfile.put("id", user.getId());
            userProfile.put("username", user.getUsername());
            userProfile.put("email", user.getEmail());
            userProfile.put("fullName", user.getFullName());
            userProfile.put("role", user.getRole());
            userProfile.put("serviceType", user.getServiceType());
            userProfile.put("address", user.getAddress());
            userProfile.put("phone", user.getPhone());
            userProfile.put("active", user.isActive());
            userProfile.put("available", user.isAvailable());
            userProfile.put("createdAt", user.getCreatedAt());
            userProfile.put("updatedAt", user.getUpdatedAt());

            return ResponseEntity.ok(userProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @RequestBody User updatedUser) {
        try {
            User user = userService.updateProfile(userId, updatedUser);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName(),
                    "address", user.getAddress(),
                    "phone", user.getPhone(),
                    "available", user.isAvailable()
            ));

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}