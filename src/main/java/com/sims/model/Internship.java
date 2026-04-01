package com.sims.model;

import jakarta.persistence.*;

@Entity
@Table(name = "internships")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String location;

    private String duration;

    private String stipend;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private User company;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;

    public enum Status {
        OPEN,
        CLOSED
    }

    // ✅ GETTERS & SETTERS

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

    public User getCompany() { return company; }
    public void setCompany(User company) { this.company = company; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}