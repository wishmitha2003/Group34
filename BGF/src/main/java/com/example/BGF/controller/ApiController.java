package com.example.BGF.controller;

import com.example.BGF.models.Product;
import com.example.BGF.models.User;
import com.example.BGF.security.JwtUtil;
import com.example.BGF.service.ProductService;
import com.example.BGF.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final ProductService productService;

    public ApiController(UserService userService, JwtUtil jwtUtil, ProductService productService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.productService = productService;
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

    // Get all products
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Get products by category
    @GetMapping("/products/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.filterByCategory(category);
        return ResponseEntity.ok(products);
    }

    // Get all categories with product count
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getAllCategories() {
        List<Product> allProducts = productService.getAllProducts();
        
        // Group products by category and count them
        Map<String, Long> categoryCount = allProducts.stream()
                .collect(Collectors.groupingBy(Product::getCategory, Collectors.counting()));
        
        // Create category objects with product count
        List<Map<String, Object>> categories = categoryCount.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> category = new HashMap<>();
                    category.put("id", "cat_" + entry.getKey());
                    category.put("title", formatCategoryTitle(entry.getKey()));
                    category.put("slug", entry.getKey());
                    category.put("productCount", entry.getValue());
                    category.put("image", getCategoryImage(entry.getKey()));
                    return category;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(categories);
    }
    
    // Search products
    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String query) {
        List<Product> products = productService.searchByName(query);
        return ResponseEntity.ok(products);
    }

    private String formatCategoryTitle(String category) {
        switch (category.toLowerCase()) {
            case "cricket": return "Cricket";
            case "football": return "Football";
            case "indoor-games": return "Indoor Games";
            case "gym": return "Gym Equipment";
            case "electronics": return "Electronics";
            case "sports": return "Sports";
            default: return category.substring(0, 1).toUpperCase() + category.substring(1);
        }
    }

    private String getCategoryImage(String category) {
        switch (category.toLowerCase()) {
            case "cricket": 
                return "https://img.freepik.com/free-photo/cricket-match-with-player_23-2151702186.jpg?w=360";
            case "football": 
                return "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";
            case "indoor-games": 
                return "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80";
            case "gym": 
                return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAGkZ6b3g6Qk_OTDYakHzBPaxE3x6YbD4xlA&s";
            case "electronics":
                return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
            case "sports":
                return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
            default: 
                return "https://via.placeholder.com/400x300?text=" + category;
        }
    }
}