USE etracker;

INSERT INTO departments(name)
VALUES 
('Sales'), 
('Finance'),
('Legal'),
('Engineering');

INSERT INTO role(title, salary, department_id)
VALUES 
('Department Manager', 120000, 1), 
('Salesperson', 70000, 2),
('Accountant', 70000, 3),
('Lawyer', 70000, 4),
('Finance Clerk', 70000, 5);

INSERT INTO employee(first_name, last_name, role_id)
VALUES 
('Fred', 'Flinstone', 1),
('Wilma', 'Flinstone', 2),
('Barney', 'Rubble', 3),
('Betty', 'Rubble', 4),
('Dino', 'Flinstone', 5),
('George', 'Slate', 1);


