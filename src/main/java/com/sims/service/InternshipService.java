package com.sims.service;

import com.sims.dto.InternshipDto;
import com.sims.model.Internship;
import com.sims.model.User;
import com.sims.repository.InternshipRepository;
import com.sims.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * InternshipService - Business logic for internship operations.
 */
@Service
public class InternshipService {

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Returns all internships in the system.
     */
    public List<InternshipDto.InternshipResponse> getAllInternships() {
        return internshipRepository.findAll()
                .stream()
                .map(InternshipDto.InternshipResponse::from) // Convert each entity to DTO
                .collect(Collectors.toList());
    }

    /**
     * Returns a single internship by ID.
     */
    public InternshipDto.InternshipResponse getInternshipById(Long id) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Internship not found with id: " + id));
        return InternshipDto.InternshipResponse.from(internship);
    }

    /**
     * Creates a new internship posting by a company user.
     */
    public InternshipDto.InternshipResponse createInternship(
            InternshipDto.CreateInternshipRequest request, String companyEmail) {

        // Find the company user
        User company = userRepository.findByEmail(companyEmail)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Build the internship entity
        Internship internship = new Internship();
        internship.setTitle(request.getTitle());
        internship.setDescription(request.getDescription());
        internship.setLocation(request.getLocation());
        internship.setDuration(request.getDuration());
        internship.setStipend(request.getStipend());
        internship.setCompany(company);
        internship.setStatus(Internship.Status.OPEN);

        return InternshipDto.InternshipResponse.from(internshipRepository.save(internship));
    }

    /**
     * Updates an existing internship (only by the company that posted it).
     */
    public InternshipDto.InternshipResponse updateInternship(
            Long id, InternshipDto.CreateInternshipRequest request, String companyEmail) {

        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        // Make sure this company owns this internship
        if (!internship.getCompany().getEmail().equals(companyEmail)) {
            throw new RuntimeException("You are not authorized to update this internship");
        }

        internship.setTitle(request.getTitle());
        internship.setDescription(request.getDescription());
        internship.setLocation(request.getLocation());
        internship.setDuration(request.getDuration());
        internship.setStipend(request.getStipend());

        return InternshipDto.InternshipResponse.from(internshipRepository.save(internship));
    }

    /**
     * Deletes an internship (Admin only - enforced at controller level).
     */
    public void deleteInternship(Long id) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Internship not found"));
        internshipRepository.delete(internship);
    }

    /**
     * Get all internships posted by a specific company.
     */
    public List<InternshipDto.InternshipResponse> getInternshipsByCompany(String companyEmail) {
        User company = userRepository.findByEmail(companyEmail)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return internshipRepository.findByCompany(company)
                .stream()
                .map(InternshipDto.InternshipResponse::from)
                .collect(Collectors.toList());
    }
}
