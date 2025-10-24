package com.example.BGF.controller;

import com.example.BGF.models.User;
import com.example.BGF.security.JwtUtil;
import com.example.BGF.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
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
                                "available", found.isAvailable()
                        ));
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.badRequest().body("Invalid credentials");
                    }
                })
                .orElse(ResponseEntity.badRequest().body("User not found"));
    }

    // Profile management endpoints
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
                    "available", user.isAvailable()
            ));

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/profile/{userId}/password")
    public ResponseEntity<?> updatePassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> passwordData) {
        try {
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");

            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Both currentPassword and newPassword are required");
            }

            User user = userService.updatePassword(userId, currentPassword, newPassword);
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/user/{userId}/active")
    public ResponseEntity<?> setActiveStatus(@PathVariable Long userId, @RequestBody Map<String, Boolean> request) {
        try {
            Boolean active = request.get("active");
            if (active == null) {
                return ResponseEntity.badRequest().body("Active status is required");
            }
            User user = userService.setUserActiveStatus(userId, active);
            String status = active ? "activated" : "deactivated";
            return ResponseEntity.ok("User " + status + " successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/user/{userId}/availability")
    public ResponseEntity<?> setAvailability(@PathVariable Long userId, @RequestBody Map<String, Boolean> request) {
        try {
            Boolean available = request.get("available");
            if (available == null) {
                return ResponseEntity.badRequest().body("Availability status is required");
            }
            User user = userService.setUserAvailability(userId, available);
            String status = available ? "available" : "unavailable";
            return ResponseEntity.ok("User marked as " + status + " successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin endpoint to reset user password
    @PutMapping("/admin/user/{userId}/password")
    public ResponseEntity<?> adminResetPassword(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            String newPassword = request.get("newPassword");
            if (newPassword == null) {
                return ResponseEntity.badRequest().body("newPassword is required");
            }
            User user = userService.adminUpdatePassword(userId, newPassword);
            return ResponseEntity.ok("Password reset successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}