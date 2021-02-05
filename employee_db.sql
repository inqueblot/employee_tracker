CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER ,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES role(id)
);

CREATE TABLE role (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30),
salary DECIMAL,
department_id INTEGER,
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE department (
id INTEGER AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Margaret", "Thatcher", 2, 1);

INSERT INTO role (title, salary, department_id)
VALUES ('Generalist', 75000, 1);

INSERT INTO department (name)
VALUES ('Human Resources');

select * from role;