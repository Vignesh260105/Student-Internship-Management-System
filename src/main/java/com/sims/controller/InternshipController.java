package com.sims.controller;

import com.sims.dto.InternshipDto;
import com.sims.service.InternshipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * InternshipController - Handles all internship-related API endpoints.
 *
 * Endpoints:
 * GET  /api/internships         - Get all internships (public)
 * GET  /api/internships/{id}    - Get one internship (public)
 * POST /api/internships         - Create internship (COMPANY only)
 * PUT  /api/internships/{id}    - Update internship (COMPANY only)
 * DELETE /api/internships/{id}  - Delete internship (ADMIN only)
 */
@RestController
@RequestMapping("/api/internships")
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    /**
     * Get all available internships - accessible to everyone.
     */
    @GetMapping
    public ResponseEntity<List<InternshipDto.InternshipResponse>> getAllInternships() {
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    /**
     * Get a single internship by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<InternshipDto.InternshipResponse> getInternshipById(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getInternshipById(id));
    }

    /**
     * Create a new internship posting.
     * Only users with COMPANY role can post internships.
     * Authentication object gives us the logged-in user's email.
     */
    @PostMapping
    @PreAuthorize("hasRole('COMPANY')") // Only company users allowed
    public ResponseEntity<InternshipDto.InternshipResponse> createInternship(
            @Valid @RequestBody InternshipDto.CreateInternshipRequest request,
            Authentication authentication) { // Spring injects this automatically

        // authentication.getName() returns the logged-in user's email
        InternshipDto.InternshipResponse response =
                internshipService.createInternship(request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    /**
     * Update an existing internship.
     * Only the company that posted it can update it.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<InternshipDto.InternshipResponse> updateInternship(
            @PathVariable Long id,
            @Valid @RequestBody InternshipDto.CreateInternshipRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
                internshipService.updateInternship(id, request, authentication.getName()));
    }

    /**
     * Delete an internship - Admin only.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteInternship(@PathVariable Long id) {
        internshipService.deleteInternship(id);
        return ResponseEntity.ok("Internship deleted successfully");
    }

    /**
     * Get all internships posted by the logged-in company.
     */
    @GetMapping("/my-postings")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<InternshipDto.InternshipResponse>> getMyInternships(
            Authentication authentication) {
        return ResponseEntity.ok(internshipService.getInternshipsByCompany(authentication.getName()));
    }
}
