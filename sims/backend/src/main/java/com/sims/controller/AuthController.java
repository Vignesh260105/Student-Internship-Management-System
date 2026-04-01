package com.sims.controller;

import com.sims.dto.AuthDto;
import com.sims.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - Handles user registration and login requests.
 *
 * Endpoints:
 * POST /api/auth/register - Create a new user account
 * POST /api/auth/login    - Login and receive JWT token
 *
 * These endpoints are PUBLIC - no token required (configured in SecurityConfig)
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Register a new user (Student, Company, or Admin).
     *
     * Request body:
     * {
     *   "name": "John Doe",
     *   "email": "john@example.com",
     *   "password": "password123",
     *   "role": "STUDENT"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<AuthDto.AuthResponse> register(
            @Valid @RequestBody AuthDto.RegisterRequest request) {
        AuthDto.AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Login with email and password, receive JWT token.
     *
     * Request body:
     * {
     *   "email": "john@example.com",
     *   "password": "password123"
     * }
     *
     * Response:
     * {
     *   "token": "eyJhbG...",
     *   "type": "Bearer",
     *   "id": 1,
     *   "name": "John Doe",
     *   "email": "john@example.com",
     *   "role": "STUDENT"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(
            @Valid @RequestBody AuthDto.LoginRequest request) {
        AuthDto.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
