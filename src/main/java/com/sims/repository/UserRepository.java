package com.sims.repository;

import com.sims.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository - handles all database operations for User entity.
 * Spring Data JPA automatically implements these methods - no SQL needed!
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used during login)
    Optional<User> findByEmail(String email);

    // Check if email already exists (used during registration)
    boolean existsByEmail(String email);
}
