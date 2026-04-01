package com.sims.repository;

import com.sims.model.Application;
import com.sims.model.Internship;
import com.sims.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ApplicationRepository - database operations for Application entity.
 */
@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Get all applications by a specific student
    List<Application> findByStudent(User student);

    // Get all applications for a specific internship
    List<Application> findByInternship(Internship internship);

    // Check if a student already applied to an internship (prevent duplicates)
    boolean existsByStudentAndInternship(User student, Internship internship);

    // Get all applications for internships posted by a company
    List<Application> findByInternship_Company(User company);
}
