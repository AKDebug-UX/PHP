CREATE DATABASE IF NOT EXISTS professorial_assessment;
USE professorial_assessment;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role ENUM('admin', 'evaluator', 'professor') NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment criteria table
CREATE TABLE assessment_criteria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    criteria_name VARCHAR(100) NOT NULL,
    description TEXT,
    weight DECIMAL(5,2) DEFAULT 1.00,
    max_score INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professors table
CREATE TABLE professors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    department VARCHAR(100),
    position VARCHAR(50),
    hire_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Assessments table
CREATE TABLE assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT,
    evaluator_id INT,
    assessment_period VARCHAR(50),
    status ENUM('draft', 'submitted', 'completed') DEFAULT 'draft',
    total_score DECIMAL(8,2),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES professors(id),
    FOREIGN KEY (evaluator_id) REFERENCES users(id)
);

-- Assessment scores table
CREATE TABLE assessment_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT,
    criteria_id INT,
    score DECIMAL(5,2),
    comments TEXT,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id),
    FOREIGN KEY (criteria_id) REFERENCES assessment_criteria(id)
);

-- Insert default admin user
INSERT INTO users (username, password, email, role, full_name) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@university.edu', 'admin', 'System Administrator');

-- Insert sample assessment criteria
INSERT INTO assessment_criteria (category, criteria_name, description, weight, max_score) VALUES
('Teaching', 'Course Delivery', 'Effectiveness in delivering course content', 3.0, 100),
('Teaching', 'Student Engagement', 'Ability to engage and motivate students', 2.5, 100),
('Teaching', 'Assessment Methods', 'Quality of student assessment methods', 2.0, 100),
('Research', 'Publications', 'Quality and quantity of research publications', 4.0, 100),
('Research', 'Grants', 'Success in obtaining research funding', 3.5, 100),
('Research', 'Innovation', 'Innovation and impact of research work', 3.0, 100),
('Service', 'Committee Work', 'Participation in university committees', 2.0, 100),
('Service', 'Community Service', 'Contribution to academic community', 1.5, 100),
('Service', 'Mentoring', 'Quality of student and colleague mentoring', 2.0, 100);
