-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS pm_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE pm_dashboard;
-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo','inprogress','done') DEFAULT 'todo',
  due_date DATE NULL,
  assignee_id INT NULL,
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL
);
