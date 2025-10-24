package com.example.BGF.service;

import com.example.BGF.models.User;
import com.example.BGF.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }

    // Update user profile
    public User updateProfile(Long userId, User updatedUser) {
        return userRepository.findById(userId)
                .map(existingUser -> {
                    // Update only allowed fields (exclude username, password, role, active status)
                    if (updatedUser.getFullName() != null) {
                        existingUser.setFullName(updatedUser.getFullName());
                    }
                    if (updatedUser.getEmail() != null) {
                        existingUser.setEmail(updatedUser.getEmail());
                    }
                    if (updatedUser.getPhone() != null) {
                        existingUser.setPhone(updatedUser.getPhone());
                    }
                    if (updatedUser.getAddress() != null) {
                        existingUser.setAddress(updatedUser.getAddress());
                    }
                    if (updatedUser.getServiceType() != null) {
                        existingUser.setServiceType(updatedUser.getServiceType());
                    }
                    // Fix: use isAvailable() instead of getAvailable()
                    if (updatedUser.isAvailable() != existingUser.isAvailable()) {
                        existingUser.setAvailable(updatedUser.isAvailable());
                    }

                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    // Update password
    public User updatePassword(Long userId, String currentPassword, String newPassword) {
        return userRepository.findById(userId)
                .map(user -> {
                    // Verify current password
                    if (!encoder.matches(currentPassword, user.getPassword())) {
                        throw new RuntimeException("Current password is incorrect");
                    }
                    user.setPassword(encoder.encode(newPassword));
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    // Admin: Update any user's password
    public User adminUpdatePassword(Long userId, String newPassword) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setPassword(encoder.encode(newPassword));
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    // Activate/Deactivate user
    public User setUserActiveStatus(Long userId, boolean active) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setActive(active);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    // Set availability status
    public User setUserAvailability(Long userId, boolean available) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setAvailable(available);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    // Get user profile
    public Optional<User> getUserProfile(Long userId) {
        return userRepository.findById(userId);
    }
}