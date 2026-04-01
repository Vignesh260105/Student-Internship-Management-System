package com.sims.dto;

import com.sims.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AuthDto {

    // ================= REGISTER =================
    public static class RegisterRequest {

        private String name;
        private String email;
        private String password;
        private User.Role role;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public User.Role getRole() { return role; }
        public void setRole(User.Role role) { this.role = role; }
    }

    // ================= LOGIN =================
    public static class LoginRequest {

        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // ================= RESPONSE =================
    public static class AuthResponse {

        private String token;
        private String type = "Bearer";
        private Long id;
        private String name;
        private String email;
        private String role;

        public AuthResponse(String token, Long id, String name, String email, String role) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public String getToken() { return token; }
        public String getType() { return type; }
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}