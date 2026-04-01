-- ============================================================
-- Student Internship Management System (SIMS) - MySQL Schema
-- ============================================================
-- Run this file in MySQL Workbench or any MySQL client.
-- The Spring Boot app will also auto-create tables via JPA,
-- but this file provides manual setup + sample data.
-- ============================================================

-- Create and select the database
CREATE DATABASE IF NOT EXISTS sims_db;
USE sims_db;

-- ============================================================
-- TABLE: users
-- Stores all users: students, companies, and admins
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100)  NOT NULL,
    email    VARCHAR(150)  NOT NULL UNIQUE,
    password VARCHAR(255)  NOT NULL,          -- BCrypt hash
    role     ENUM('STUDENT', 'COMPANY', 'ADMIN') NOT NULL,
    INDEX idx_email (email)
);

-- ============================================================
-- TABLE: internships
-- Internship postings created by companies
-- ============================================================
CREATE TABLE IF NOT EXISTS internships (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200)  NOT NULL,
    description TEXT          NOT NULL,
    location    VARCHAR(150),
    duration    VARCHAR(100),                 -- e.g. "3 months"
    stipend     VARCHAR(100),                 -- e.g. "10000/month"
    status      ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    company_id  BIGINT        NOT NULL,
    CONSTRAINT fk_internship_company
        FOREIGN KEY (company_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================
-- TABLE: applications
-- Student applications to internships
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id     BIGINT NOT NULL,
    internship_id  BIGINT NOT NULL,
    status         ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    cover_letter   TEXT,
    CONSTRAINT fk_application_student
        FOREIGN KEY (student_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_application_internship
        FOREIGN KEY (internship_id) REFERENCES internships(id)
        ON DELETE CASCADE,
    -- Prevent a student from applying twice to the same internship
    UNIQUE KEY uq_student_internship (student_id, internship_id)
);

-- ============================================================
-- SAMPLE DATA
-- Passwords below are BCrypt hashes of "password123"
-- You can use these to test login immediately
-- ============================================================

-- Admin user (email: admin@sims.com / password: password123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User',
 'admin@sims.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'ADMIN');

-- Company users
INSERT INTO users (name, email, password, role) VALUES
('TechCorp India',
 'techcorp@company.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'COMPANY'),
('InnoSoft Solutions',
 'innosoft@company.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'COMPANY');

-- Student users
INSERT INTO users (name, email, password, role) VALUES
('Arjun Sharma',
 'arjun@student.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'STUDENT'),
('Priya Patel',
 'priya@student.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'STUDENT');

-- Sample internships (posted by company id=2 and id=3)
INSERT INTO internships (title, description, location, duration, stipend, status, company_id) VALUES
('Java Backend Developer Intern',
 'Work on Spring Boot microservices. Learn REST API design, database optimization, and CI/CD pipelines. Ideal for students with Java knowledge.',
 'Hyderabad',
 '3 months',
 '₹15,000/month',
 'OPEN',
 2),
('React Frontend Developer Intern',
 'Build modern React.js applications. Work with hooks, Redux, and REST APIs. Collaborate with design and backend teams.',
 'Bangalore',
 '6 months',
 '₹12,000/month',
 'OPEN',
 2),
('Full Stack Developer Intern',
 'End-to-end development using Node.js and React. Gain experience in MongoDB, REST APIs, and deployment on AWS.',
 'Remote',
 '4 months',
 '₹18,000/month',
 'OPEN',
 3),
('Data Science Intern',
 'Analyze business data using Python, Pandas, and Matplotlib. Build dashboards and predictive models under senior guidance.',
 'Chennai',
 '3 months',
 '₹10,000/month',
 'OPEN',
 3);

-- Sample applications
INSERT INTO applications (student_id, internship_id, status, cover_letter) VALUES
(4, 1, 'PENDING',  'I am passionate about Java and eager to learn Spring Boot at your company.'),
(4, 3, 'ACCEPTED', 'Full stack development aligns perfectly with my skill set.'),
(5, 2, 'PENDING',  'I have built several React projects and am excited about this opportunity.'),
(5, 4, 'REJECTED', 'I enjoy data analysis and Python programming.');

-- ============================================================
-- Verify the data
-- ============================================================
SELECT 'Users:'       AS '';  SELECT id, name, email, role FROM users;
SELECT 'Internships:' AS '';  SELECT id, title, location, status FROM internships;
SELECT 'Applications:' AS ''; SELECT id, student_id, internship_id, status FROM applications;
