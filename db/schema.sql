-- Create tables if they don't exist --
DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;
USE employeetracker_db;

-- Create corresponding tables --
CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    roles_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DEC(7,2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE SET NULL
);

CREATE TABLE employee (
    employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    roles_id INT, 
    FOREIGN KEY (roles_id) REFERENCES roles(roles_id) ON DELETE SET NULL,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(employee_id) ON DELETE SET NULL
);