package com.sims.service;

import com.sims.dto.AuthDto;
import com.sims.model.User;
import com.sims.repository.UserRepository;
import com.sims.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthService - Business logic for user registration and login.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Registers a new user account.
     * Steps:
     * 1. Check if email already exists
     * 2. Encrypt the password using BCrypt
     * 3. Save user to database
     * 4. Generate and return JWT token
     */
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        // Check if email is already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered: " + request.getEmail());
        }

        // Create new user with encrypted password
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash the password!
        user.setRole(request.getRole());

        // Save to database
        User savedUser = userRepository.save(user);

        // Generate JWT token for the new user
        String token = jwtUtils.generateToken(savedUser.getEmail());

        return new AuthDto.AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    /**
     * Authenticates user login.
     * Steps:
     * 1. Use Spring Security's AuthenticationManager to verify credentials
     * 2. If valid, generate and return JWT token
     * 3. If invalid, Spring Security throws an exception automatically
     */
    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        // This verifies email + password against database
        // Throws BadCredentialsException if wrong
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user from database to include in response
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT token
        String token = jwtUtils.generateToken(user.getEmail());

        return new AuthDto.AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
