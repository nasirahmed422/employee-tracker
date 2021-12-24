-- CREATE STARTER DATA TO GO INSIDE TABLES --
USE employeetracker_db;

INSERT INTO department (name) VALUES 
('Engineering'),
('Sales'),
('Marketing'),
('Finance');

INSERT INTO roles (title, salary, department_id) VALUES
('QA Engineer', 80000, 1),
('Developer', 95000, 1),
('Sales Manager', 70000, 2), 
('Marketing Manager', 70000, 3), 
('Accountant', 85000, 4);


INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES
('John', 'Doe', 17, null),
('Jane', 'Doe', 16, null),
('Mike', 'Hunt', 19, null),
('James', 'Black', 18, null);
