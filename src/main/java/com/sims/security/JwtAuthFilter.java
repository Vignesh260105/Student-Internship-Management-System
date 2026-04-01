package com.sims.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JwtAuthFilter - Intercepts every HTTP request and validates the JWT token.
 *
 * This filter runs BEFORE Spring Security processes the request.
 * It checks the Authorization header for a Bearer token and authenticates the user.
 *
 * Flow:
 * 1. Extract token from "Authorization: Bearer <token>" header
 * 2. Validate token
 * 3. Load user details from database
 * 4. Set authentication in SecurityContext (marks user as authenticated)
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Step 1: Extract JWT from Authorization header
        String jwt = extractJwtFromRequest(request);

        // Step 2: If token exists and is valid format
        if (StringUtils.hasText(jwt) && jwtUtils.validateTokenFormat(jwt)) {

            // Step 3: Get username (email) from token
            String email = jwtUtils.getUsernameFromToken(jwt);

            // Step 4: Load full user details from database
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // Step 5: Validate token against user details
            if (jwtUtils.validateToken(jwt, userDetails)) {

                // Step 6: Create authentication token and set in security context
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,                           // Credentials (not needed after auth)
                                userDetails.getAuthorities()    // User roles
                        );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Mark user as authenticated for this request
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // Continue to next filter in chain
        filterChain.doFilter(request, response);
    }

    /**
     * Extracts the JWT token from the Authorization header.
     * Expected format: "Bearer eyJhbGc..."
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        // Check if header exists and starts with "Bearer "
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix (7 characters)
        }
        return null;
    }
}
