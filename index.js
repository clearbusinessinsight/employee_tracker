const inquirer = require('inquirer');
const connection = require('./db/connection');
const cTable = require('console.table');

function newPrompt () {
  const promptChoices = [{
    type: 'list',
    name: 'choices',
    message: 'What would you like to do?',
    loop: false,
    choices: [
      'View All Employees',
      'View All Roles',
      'View All Departments',
      'View Employees by Manager',
      'View the Budget of a Department',
      'Add Employee',
      'Add Role',
      'Add Department',
      'Change Employee Role',
      'Change Employees Manager',
      'Delete Department',
      'Delete a Role',
      'Delete an Employee',
      'Quit']
  }]
     inquier.prompt(promptChoices)
  .then(response => {
    switch (response.action) {
      case 'View All Employees':
        viewEmployee();
        break;
      case 'View All Roles':
        viewRole();
        break;
      case 'View All Departments':
        viewDepartment();
        break;
      case 'ViewEmployees by Manager':
        viewEmployeeByManager();
        break;
      case 'View the Budget of a Department':
        viewBudget();
        break;
      case "Add Department":
        addNewDepartment();
        break;
      case "Add Role":
        addNewRole();
        break;
      case "Add Employee":
        addNewEmployee();
        break;
      case "Change Employee Role":
        updateRole();
        break;
      case "Change Employee's Manager":
        updateManager();
        break;
      case "Delete Department":
        deleteDepartment();
        break;
      case "Delete a Role":
        deleteRole();
        break;
      case "Delete an Employee":
        deleteEmployee();
        break;
      default:
        connection.end();
    }
  })
  .catch(error => {
    console.error(error);
  });
};

//  View Employee
const viewEmployee = () => {
  let query;
  query = `SELECT Employee.id AS id, Employee.first_name AS first_name, Employee.last_name AS last_name, 
    Role.title AS role, Department.name AS department, CONCAT(M.first_name, " ", M.last_name) AS manager
    FROM EMPLOYEE AS Employee LEFT JOIN ROLE AS Role ON Employee.role_id = Role.id
    LEFT JOIN DEPARTMENT AS Department ON Role.department_id = Department.id
    LEFT JOIN EMPLOYEE AS Manager ON Employee.manager_id = Manager.id;`;
  
  connection.query(query, (error, res) => {
    if (eror) throw error;
    console.table(res);

    newPrompt();
  });
};


//  View Department
const viewDepartment = () => {
  let query;
query = `SELECT * FROM DEPARTMENT`;
  
  connection.query(query, (error, res) => {
    if (error) throw error;
    console.table(res);

    newPrompt();
  });
};

// View Role
const viewRole = () => {
  let query;
 query = `SELECT Role.id AS id, title, salary, Department.name AS department
    FROM ROLE AS Role LEFT JOIN DEPARTMENT AS Department
    ON Role.department_id = Department.id;`;
  
  connection.query(query, (error, res) => {
    if (error) throw error;
    console.table(res);

    newPrompt();
  });
};


//  View Employee by Manager
const viewEmployeeByManager = () => {
  connection.query("SELECT * FROM EMPLOYEE", (error, employeeRes) => {
    if (error) throw err;
    const employeeChoice = [{
      name: 'None',
      value: 0
    }];
    employeeRes.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
     
    let questions = [
      {
        type: "list",
        name: "manager_id",
        choices: employeeChoice,
        message: "Who do you want to update?"
      },
    ]
  
    inquier.prompt(questions)
      .then(response => {
        let manager_id, query;
        if (response.manager_id) {
          query = `SELECT Employee.id AS id,
                          Employee.first_name AS first_name,
                          Employee.last_name AS last_name, 
                          Role.title AS role,
                          Department.name AS department, 
                          CONCAT(M.first_name, " ", M.last_name) AS manager
                  FROM EMPLOYEE AS E 
                          LEFT JOIN ROLE AS R ON E.role_id = R.id
                          LEFT JOIN DEPARTMENT AS D ON R.department_id = D.id
                          LEFT JOIN EMPLOYEE AS M ON E.manager_id = M.id
                  WHERE E.manager_id = ?;`;
        } else {
          manager_id = null;
          query = `SELECT E.id AS id, 
                          E.first_name AS first_name, 
                          E.last_name AS last_name, 
                          R.title AS role, 
                          D.name AS department, 
                          CONCAT(M.first_name, " ", M.last_name) AS manager
                  FROM EMPLOYEE AS E 
                          LEFT JOIN ROLE AS R ON E.role_id = R.id
                          LEFT JOIN DEPARTMENT AS D ON R.department_id = D.id
                          LEFT JOIN EMPLOYEE AS M ON E.manager_id = M.id
                  WHERE E.manager_id is null;`;
        }
        connection.query(query, [response.manager_id], (error, res) => {
          if (error) throw error;
          console.table(res);
          newPrompt();
        });
      })
      .catch(error => {
        console.error(error);
      });
  });
};

 //View the Budget of a Department
  const viewBudget = () => {
  connection.query("SELECT * FROM DEPARTMENT", (error, res) => {
    if (error) throw error;

    const budget = [];
    res.forEach(({ name, id }) => {
      budget.push({
        name: name,
        value: id
      });
    });

    let questions = [
      {
        type: "list",
        name: "id",
        choices: budget,
        message: "What Budget do you want to see?"
      }
    ];

    inquier.prompt(questions)
    .then(response => {
      const query = `SELECT Department.name, 
                     SUM(salary) AS budget FROM EMPLOYEE AS Employee
                     LEFT JOIN ROLE AS Role ON Employee.role_id = Role.id
                     LEFT JOIN DEPARTMENT AS Department ON Role.department_id = Department.id
                     WHERE Department.id = ?`;
      connection.query(query, [response.id], (err, res) => {
        if (err) throw err;
        console.table(res);
        startPrompt();
      });
    })
    .catch(err => {
      console.error(err);
    });
  });

};
 //Add Department
      
 // Add Role":
      
 //  Add Employee":
        
//  Change Employee Role
      
// Change Employee's Manager":
     
// Delete Department
      
//  Delete a Role":
  

// Delete an Employee":
       
     








// Exit the application
function quit() {
  console.log("Goodbye!");
  process.exit();
}
