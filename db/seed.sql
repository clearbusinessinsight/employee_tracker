INSERT INTO department (name)
VALUES ("Accounting"),
    ("Production"),
    ("Sales");

SELECT * FROM DEPARTMENT;

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 70000, Null),
    ("Production Manager", 80000, 1)
    ("Sales rep", 85000, 2);

SELECT * FROM ROLE;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, NULL),
    ("Tom", "Cat", 3, 1),
    ("Jerry", "Jones", 1, 1),
    ("Mickey", "Mouse", 3, 2),
    ("Minnie", "Mouse", 2, 1);

SELECT * FROM employee;
