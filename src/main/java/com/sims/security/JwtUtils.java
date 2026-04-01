package com.sims.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * JwtUtils - Handles JWT token creation, parsing, and validation.
 *
 * JWT tokens contain:
 * - Subject: user's email
 * - Issued at: when the token was created
 * - Expiration: when the token expires
 * - Signature: ensures token hasn't been tampered with
 */
@Component
public class JwtUtils {

    // Read from application.properties
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationMs;

    /**
     * Creates a signing key from the secret string.
     * Key must be long enough for HMAC-SHA256 algorithm.
     */
    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generates a JWT token for a given username (email).
     * Token is valid for jwtExpirationMs milliseconds.
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)                              // Store email as subject
                .setIssuedAt(new Date())                           // Token creation time
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs)) // Expiry time
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Sign with our secret
                .compact();                                        // Build the token string
    }

    /**
     * Extracts the username (email) from a JWT token.
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); // Get the subject (email)
    }

    /**
     * Validates whether a JWT token is valid.
     * Checks signature and expiration.
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = getUsernameFromToken(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (Exception e) {
            return false; // Any exception means invalid token
        }
    }

    /**
     * Checks if token is expired.
     */
    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date()); // True if expired
    }

    /**
     * Validates token format and signature (without UserDetails).
     * Used in the JWT filter before loading user details.
     */
    public boolean validateTokenFormat(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException | ExpiredJwtException | UnsupportedJwtException |
                 IllegalArgumentException e) {
            return false;
        }
    }
}
