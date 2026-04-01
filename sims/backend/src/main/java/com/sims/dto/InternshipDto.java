package com.sims.dto;

import com.sims.model.Application;
import com.sims.model.Internship;
import jakarta.validation.constraints.NotBlank;

public class InternshipDto {

    // ================= CREATE =================
    public static class CreateInternshipRequest {

        private String title;
        private String description;
        private String location;
        private String duration;
        private String stipend;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }

        public String getStipend() { return stipend; }
        public void setStipend(String stipend) { this.stipend = stipend; }
    }

    // ================= INTERNSHIP RESPONSE =================
    public static class InternshipResponse {

        private Long id;
        private String title;
        private String description;
        private String location;
        private String duration;
        private String stipend;
        private String status;
        private Long companyId;
        private String companyName;

        public static InternshipResponse from(Internship internship) {
            InternshipResponse dto = new InternshipResponse();

            dto.setId(internship.getId());
            dto.setTitle(internship.getTitle());
            dto.setDescription(internship.getDescription());
            dto.setLocation(internship.getLocation());
            dto.setDuration(internship.getDuration());
            dto.setStipend(internship.getStipend());

            if (internship.getStatus() != null) {
                dto.setStatus(internship.getStatus().name());
            }

            if (internship.getCompany() != null) {
                dto.setCompanyId(internship.getCompany().getId());
                dto.setCompanyName(internship.getCompany().getName());
            }

            return dto;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }

        public String getStipend() { return stipend; }
        public void setStipend(String stipend) { this.stipend = stipend; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Long getCompanyId() { return companyId; }
        public void setCompanyId(Long companyId) { this.companyId = companyId; }

        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
    }

    // ================= APPLY =================
    public static class ApplyRequest {

        private Long internshipId;
        private String coverLetter;

        public Long getInternshipId() { return internshipId; }
        public void setInternshipId(Long internshipId) { this.internshipId = internshipId; }

        public String getCoverLetter() { return coverLetter; }
        public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
    }

    // ================= UPDATE STATUS =================
    public static class UpdateStatusRequest {

        private Application.Status status;

        public Application.Status getStatus() { return status; }
        public void setStatus(Application.Status status) { this.status = status; }
    }

    // ================= APPLICATION RESPONSE =================
    public static class ApplicationResponse {

        private Long id;
        private String status;
        private String coverLetter;
        private Long studentId;
        private String studentName;
        private Long internshipId;
        private String internshipTitle;
        private String companyName;

        public static ApplicationResponse from(Application app) {
            ApplicationResponse dto = new ApplicationResponse();

            dto.setId(app.getId());

            if (app.getStatus() != null) {
                dto.setStatus(app.getStatus().name());
            }

            dto.setCoverLetter(app.getCoverLetter());

            if (app.getStudent() != null) {
                dto.setStudentId(app.getStudent().getId());
                dto.setStudentName(app.getStudent().getName());
            }

            if (app.getInternship() != null) {
                dto.setInternshipId(app.getInternship().getId());
                dto.setInternshipTitle(app.getInternship().getTitle());

                if (app.getInternship().getCompany() != null) {
                    dto.setCompanyName(app.getInternship().getCompany().getName());
                }
            }

            return dto;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getCoverLetter() { return coverLetter; }
        public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }

        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }

        public Long getInternshipId() { return internshipId; }
        public void setInternshipId(Long internshipId) { this.internshipId = internshipId; }

        public String getInternshipTitle() { return internshipTitle; }
        public void setInternshipTitle(String internshipTitle) { this.internshipTitle = internshipTitle; }

        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
    }
}