INSERT INTO department (name)
VALUES ("Production"),
    ("Accounting"),
    ("Sales");

SELECT * FROM DEPARTMENT;

INSERT INTO role (title, salary, department_id)
VALUES ("Production Manager", 104000, 1),
    ("Accountant", 70000, 2),
    ("Sales Rep", 85000, 3);

SELECT * FROM ROLE;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "White", 1, NULL),
    ("Tom", "Cat", 3, 1),
    ("Jerry", "Jones", 1, 1),
    ("Mickey", "Mouse", 3, 2),
    ("Minnie", "Mouse", 2, 1);

SELECT * FROM employee;
