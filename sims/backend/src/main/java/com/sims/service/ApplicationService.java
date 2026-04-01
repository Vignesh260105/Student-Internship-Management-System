package com.sims.service;

import com.sims.dto.InternshipDto;
import com.sims.model.Application;
import com.sims.model.Internship;
import com.sims.model.User;
import com.sims.repository.ApplicationRepository;
import com.sims.repository.InternshipRepository;
import com.sims.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ApplicationService - Business logic for internship applications.
 */
@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Student applies to an internship.
     * Prevents duplicate applications.
     */
    public InternshipDto.ApplicationResponse applyToInternship(
            InternshipDto.ApplyRequest request, String studentEmail) {

        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Internship internship = internshipRepository.findById(request.getInternshipId())
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        // Check if internship is still open
        if (internship.getStatus() != Internship.Status.OPEN) {
            throw new RuntimeException("This internship is no longer accepting applications");
        }

        // Prevent duplicate applications
        if (applicationRepository.existsByStudentAndInternship(student, internship)) {
            throw new RuntimeException("You have already applied to this internship");
        }

        Application application = new Application();
        application.setStudent(student);
        application.setInternship(internship);
        application.setCoverLetter(request.getCoverLetter());
        application.setStatus(Application.Status.PENDING);

        return InternshipDto.ApplicationResponse.from(applicationRepository.save(application));
    }

    /**
     * Returns applications based on the logged-in user's role:
     * - ADMIN: all applications
     * - COMPANY: applications for their internships
     * - STUDENT: their own applications
     */
    public List<InternshipDto.ApplicationResponse> getApplications(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Application> applications;

        switch (user.getRole()) {
            case ADMIN:
                applications = applicationRepository.findAll();
                break;
            case COMPANY:
                applications = applicationRepository.findByInternship_Company(user);
                break;
            case STUDENT:
            default:
                applications = applicationRepository.findByStudent(user);
                break;
        }

        return applications.stream()
                .map(InternshipDto.ApplicationResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Get all applications submitted by a specific student.
     */
    public List<InternshipDto.ApplicationResponse> getApplicationsByStudent(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return applicationRepository.findByStudent(student)
                .stream()
                .map(InternshipDto.ApplicationResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Company or Admin updates an application's status to ACCEPTED or REJECTED.
     */
    public InternshipDto.ApplicationResponse updateApplicationStatus(
            Long applicationId, InternshipDto.UpdateStatusRequest request, String userEmail) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If company: ensure they own the internship this application is for
        if (user.getRole() == User.Role.COMPANY) {
            if (!application.getInternship().getCompany().getId().equals(user.getId())) {
                throw new RuntimeException("Not authorized to update this application");
            }
        }

        application.setStatus(request.getStatus());
        return InternshipDto.ApplicationResponse.from(applicationRepository.save(application));
    }
}
