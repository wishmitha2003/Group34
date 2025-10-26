package com.example.BGF.security;

import com.example.BGF.models.User;
import com.example.BGF.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = jwtUtil.extractUsername(token);
                String role = jwtUtil.extractRole(token);

                System.out.println("JWT Filter - Username: " + username + ", Role: " + role);

                // Fetch User from DB
                User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));

                // Exclude password
                user.setPassword(null);

                // Set authentication with User as principal
                // Ensure role has ROLE_ prefix for Spring Security
                String authorityRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                System.out.println("JWT Filter - Authority Role: " + authorityRole);
                
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(user, null,
                                Collections.singleton(() -> authorityRole));
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("JWT Filter - Authentication set successfully for user: " + username);

            } catch (Exception e) {
                System.out.println("Invalid JWT: " + e.getMessage());
                e.printStackTrace();
            }
        }
        filterChain.doFilter(request, response);
    }
}

