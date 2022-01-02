---DEPARTMENTS---
INSERT INTO department (name)
VALUE ("QA");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Finance");
INSERT INTO department (name)
VALUE ("HR");

---ROLES---
INSERT INTO role (title, salary, department_id)
VALUE ("Manager Engineering", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Manager HR", 100000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Senior QA", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Automation Engineer", 120000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);

---EMPLOYEES---
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Johnny", "Cage", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Mike", "Hunt", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Maggi","Paggi",null,3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Liu", "Kang", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Devorah", "Buggz", 4, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Quan", "Chi", 1, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Sarah", "Dudley", 2, 7);
