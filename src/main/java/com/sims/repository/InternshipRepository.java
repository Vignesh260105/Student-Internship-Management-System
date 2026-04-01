package com.sims.repository;

import com.sims.model.Internship;
import com.sims.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * InternshipRepository - database operations for Internship entity.
 */
@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {

    // Get all internships posted by a specific company
    List<Internship> findByCompany(User company);

    // Get all open internships
    List<Internship> findByStatus(Internship.Status status);
}
