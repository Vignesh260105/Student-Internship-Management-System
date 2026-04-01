package com.sims.config;

import com.sims.security.JwtAuthFilter;
import com.sims.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * SecurityConfig - Configures Spring Security for the application.
 *
 * Key settings:
 * - CORS: Allow requests from React frontend (localhost:3000)
 * - CSRF: Disabled (not needed for REST APIs with JWT)
 * - Session: Stateless (JWT handles session, no server-side session)
 * - Authorization: /auth/** is public, everything else requires login
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize annotations on controller methods
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    /**
     * BCrypt password encoder - hashes passwords before storing.
     * Industry standard - cannot be reversed to get original password.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Authentication provider - tells Spring how to verify login credentials.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // How to load user
        authProvider.setPasswordEncoder(passwordEncoder());     // How to check password
        return authProvider;
    }

    /**
     * AuthenticationManager - used in AuthController to authenticate users.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Main security filter chain - defines security rules for all HTTP requests.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS with our configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Disable CSRF - not needed for stateless REST APIs
            .csrf(csrf -> csrf.disable())

            // Define which routes require authentication
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no token required
                .requestMatchers("/api/auth/**").permitAll()
                // Viewing internships is public
                .requestMatchers(HttpMethod.GET, "/api/internships").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/internships/**").permitAll()
                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            // Use stateless session - JWT replaces server sessions
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Register our authentication provider
            .authenticationProvider(authenticationProvider())

            // Add JWT filter BEFORE Spring's default authentication filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS configuration - allows React frontend to call our API.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow requests from React dev server
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));

        // Allow standard HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all headers (including Authorization for JWT)
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Allow credentials (cookies, auth headers)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply to all routes
        return source;
    }
}
