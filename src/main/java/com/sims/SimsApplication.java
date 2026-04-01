package com.sims;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Student Internship Management System backend.
 * Run this class to start the Spring Boot application.
 */
@SpringBootApplication
public class SimsApplication {

    public static void main(String[] args) {
        SpringApplication.run(SimsApplication.class, args);
        System.out.println("✅ SIMS Backend is running at http://localhost:8080");
    }
}
