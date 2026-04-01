package com.sims.controller;

import com.sims.dto.InternshipDto;
import com.sims.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ApplicationController - Handles internship application endpoints.
 *
 * Endpoints:
 * POST /api/applications              - Apply to internship (STUDENT)
 * GET  /api/applications              - Get applications (role-based)
 * PUT  /api/applications/{id}         - Accept or reject (COMPANY/ADMIN)
 * GET  /api/applications/my-applications - Student's own applications
 */
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    /**
     * Student applies to an internship.
     */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<InternshipDto.ApplicationResponse> applyToInternship(
            @RequestBody InternshipDto.ApplyRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
                applicationService.applyToInternship(request, authentication.getName()));
    }

    /**
     * Get applications:
     * - ADMIN: sees all applications
     * - COMPANY: sees applications for their internships
     * - STUDENT: sees their own applications
     */
    @GetMapping
    public ResponseEntity<List<InternshipDto.ApplicationResponse>> getApplications(
            Authentication authentication) {
        return ResponseEntity.ok(applicationService.getApplications(authentication));
    }

    /**
     * Get only the logged-in student's applications.
     */
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<InternshipDto.ApplicationResponse>> getMyApplications(
            Authentication authentication) {
        return ResponseEntity.ok(
                applicationService.getApplicationsByStudent(authentication.getName()));
    }

    /**
     * Company or Admin accepts/rejects an application.
     *
     * Request body: { "status": "ACCEPTED" } or { "status": "REJECTED" }
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY') or hasRole('ADMIN')")
    public ResponseEntity<InternshipDto.ApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody InternshipDto.UpdateStatusRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(id, request, authentication.getName()));
    }
}
