use employee_db;

INSERT INTO
  department (name) VALUE ("Sales");
INSERT INTO
  department (name) VALUE ("Engineering");
INSERT INTO
  department (name) VALUE ("Accounting");
INSERT INTO
  department (name) VALUE ("Legal");
INSERT INTO
  department (name) VALUE ("Human Resources");
INSERT INTO
  department (name) VALUE ("Customer Service");
INSERT INTO
  role (title, salary, department_id) VALUE ("Lead Engineer", 175000, 2);
INSERT INTO
  role (title, salary, department_id) VALUE ("Lead Counsel", 275000, 3);
INSERT INTO
  role (title, salary, department_id) VALUE ("Accountant", 125000, 4);
INSERT INTO
  role (title, salary, department_id) VALUE ("Sales Lead", 100000, 1);
INSERT INTO
  role (title, salary, department_id) VALUE ("Salesperson", 75000, 1);
INSERT INTO
  role (title, salary, department_id) VALUE ("Software Engineer", 125000, 2);
INSERT INTO
  role (title, salary, department_id) VALUE ("Lawyer", 195000, 3);
INSERT INTO
  employee (first_name, last_name, manager_id, role_id) VALUE ("Jason", "Barbanel", null, 1);
INSERT INTO
  employee (first_name, last_name, manager_id, role_id) VALUE ("Mike", "Tyson", null, 2);
INSERT INTO
  employee (first_name, last_name, manager_id, role_id) VALUE ("Obi", "Toppin", null, 3);
INSERT INTO
  employee (first_name, last_name, manager_id, role_id) VALUE ("Patrick", "Ewing", 1, 4);
INSERT INTO
  employee (first_name, last_name, manager_id, role_id) VALUE ("Carmelo", "Anthony", 4, 5);
INSERT INTO
  employee (first_name, last_name, manager_id, role_id) VALUE ("Sue", "Bird", 1, 6);
INSERT INTO
  employee (first_name, last_name, manager_id, role_id) VALUE ("Serena", "Williams", 2, 7);