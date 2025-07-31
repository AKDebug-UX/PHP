-- Create database
CREATE DATABASE IF NOT EXISTS mail_tracking_system;
USE mail_tracking_system;

-- Create mails table
CREATE TABLE IF NOT EXISTS mails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    sender VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    status ENUM('pending', 'sent', 'received', 'returned') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    department VARCHAR(255) NOT NULL,
    description TEXT,
    date_sent DATE NULL,
    date_received DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tracking_number (tracking_number),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_department (department),
    INDEX idx_created_at (created_at)
);

-- Insert sample data
INSERT INTO mails (tracking_number, sender, recipient, subject, status, priority, department, description, date_sent, date_received) VALUES
('ESU-MAIL-2024-001', 'Registrar Office', 'Computer Science Dept', 'Student Admission Letters', 'sent', 'high', 'Academic Affairs', 'Batch of admission letters for new students', '2024-01-15', NULL),
('ESU-MAIL-2024-002', 'Bursar Office', 'All Departments', 'Fee Payment Notices', 'pending', 'medium', 'Finance', 'Fee payment reminders for students', NULL, NULL),
('ESU-MAIL-2024-003', 'Vice Chancellor Office', 'Faculty of Science', 'Research Grant Approval', 'received', 'high', 'Administration', 'Approval letters for research grants', '2024-01-10', '2024-01-12'),
('ESU-MAIL-2024-004', 'Student Affairs', 'All Students', 'Orientation Schedule', 'sent', 'medium', 'Student Affairs', 'Schedule for new student orientation', '2024-01-20', NULL),
('ESU-MAIL-2024-005', 'Library', 'Faculty of Arts', 'Book Acquisition Notice', 'returned', 'low', 'Academic Affairs', 'Notice about new book acquisitions', '2024-01-18', NULL);

-- Create users table for authentication (optional)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'student') DEFAULT 'staff',
    department VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role, department) VALUES
('admin', 'admin@esu.edu.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administration');