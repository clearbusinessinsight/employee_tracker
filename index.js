
const cTable = require('console.table');
const mysql = require("mysql");
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "employees"
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  newPrompt();
});



function newPrompt () {
  const promptChoices = [{
    type: 'list',
    name: 'choices',
    message: 'What would you like to do?',
    loop: false,
    choices: [
      "View All Employees",
      "View All Roles",
      "View All Departments",
      "View Employees by Manager",
      "View the Budget of a Department",
      "Add Employee",
      "Add Role",
      "Add Department",
      "Change Employee Role",
      "Change Employees Manager",
      "Delete Department",
      "Delete a Role",
      "Delete an Employee",
      "Quit"]
  }]
     inquirer.prompt(promptChoices)
  .then(response => {
    switch (response.choices) {
      case 'View All Employees':
        viewEmployee();
        break;
      case 'View All Roles':
        viewRole();
        break;
      case 'View All Departments':
        viewDepartment();
        break;
       case "View Employees by Manager":
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
    Role.title AS role, Department.name AS department, CONCAT(Manager.first_name, " ", Manager.last_name) AS manager
    FROM EMPLOYEE AS Employee LEFT JOIN ROLE AS Role ON Employee.role_id = Role.id
    LEFT JOIN DEPARTMENT AS Department ON Role.department_id = Department.id
    LEFT JOIN EMPLOYEE AS Manager ON Employee.manager_id = Manager.id;`;
  
  connection.query(query, (err, res) => {
    if (err) throw err;
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

const viewEmployeeByManager =  () => {
  //get all the employee list 
  connection.query("SELECT * FROM EMPLOYEE", (err, emplRes) => {
    if (err) throw err;
    const employeeChoice = [{
      name: 'None',
      value: 0
    }];
    emplRes.forEach(({ first_name, last_name, id }) => {
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
         message: "whose role do you want to update?"
      },
    ]
  
    inquirer.prompt(questions)
      .then(response => {
        let manager_id, query;
        if (response.manager_id) {
          query = `SELECT Employee.id AS id, 
                          Employee.first_name AS first_name, 
                          Employee.last_name AS last_name, 
                          Role.title AS role, 
                          Department.name AS department, 
                          CONCAT(Manager.first_name, " ", Manager.last_name) AS manager
                  FROM EMPLOYEE AS Employee LEFT JOIN ROLE AS Role ON Employee.role_id = Role.id
                                            LEFT JOIN DEPARTMENT AS Department ON Role.department_id = Department.id
                                            LEFT JOIN EMPLOYEE AS Manager ON Employee.manager_id = Manager.id
                  WHERE E.manager_id = ?;`;
        } else {
          manager_id = null;
          query = `SELECT Employee.id AS id, 
                          Employee.first_name AS first_name, 
                          Employee.last_name AS last_name, 
                          Role.title AS role, 
                          Department.name AS department, CONCAT(Manager.first_name, " ", Manager.last_name) AS manager
                  FROM EMPLOYEE AS Employee LEFT JOIN ROLE AS Role ON Employee.role_id = Role.id
                                            LEFT JOIN DEPARTMENT AS Department ON Role.department_id = Department.id
                                            LEFT JOIN EMPLOYEE AS Manager ON Employee.manager_id = Manager.id
                  WHERE E.manager_id is null;`;
        }
        connection.query(query, [response.manager_id], (err, res) => {
          if (err) throw err;
          console.table(res);
          newPrompt();
        });
      })
      .catch(err => {
        console.error(err);
      }); 
  });
}



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

    inquirer.prompt(questions)
    .then(response => {
      const query = `SELECT Department.name, 
                     SUM(salary) AS budget FROM EMPLOYEE AS Employee
                     LEFT JOIN ROLE AS Role ON Employee.role_id = Role.id
                     LEFT JOIN DEPARTMENT AS Department ON Role.department_id = Department.id
                     WHERE Department.id = ?`;
      connection.query(query, [response.id], (error, res) => {
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
 //Add Department
const addNewDepartment = () => {
  let questions = [
    {
      type: "input",
      name: "name",
      message: "What is the name of the New Department?"
    }
  ];

  inquirer.prompt(questions)
    .then(response => {
      const query = `INSERT INTO department (name) VALUES (?)`;
      connection.query(query, [response.name], (err, res) => {
        if (err) throw err;
      console.log(`Added ${response.name} department at id ${res.insertId}`);
      newPrompt();
    });
  })
    .catch(err => {
      console.error(err);
    });
};

 // Add Role":
      const addNewRole = () => {
 
  const departments = [];
  connection.query("SELECT * FROM DEPARTMENT", (error, res) => {
    if (error) throw error;

    res.forEach(department => {
      let queryObj = {
        name: department.name,
        value: department.id
      }
      departments.push(queryObj);
    });

    let questions = [
      {
        type: "input",
        name: "title",
        message: "What is the Title of the New Role?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the Salary of the New Role?"
      },
      {
        type: "list",
        name: "department",
        choices: departments,
        message: "Which Department is this Role in?"
      }
    ];

    inquirer.prompt(questions)
    .then(response => {
      const query = `INSERT INTO ROLE (title, salary, department_id) VALUES (?)`;
      connection.query(query, [[response.title, response.salary, response.department]], (error, res) => {
        if (error) throw error;
        console.log(`Added ${response.title} role at id ${res.insertId}`);
        newPrompt();
      });
    })
    .catch(error => {
      console.error(error);
    });
  });
}

 //  Add Employee":
      
const addNewEmployee = () => {

  connection.query("SELECT * FROM EMPLOYEE", (error, employeeRes) => {
    if (error) throw error;
    let employeeChoice = [
      {
        name: 'None',
        value: 0
      }
    ];

    employeeRes.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
    

    connection.query("SELECT * FROM ROLE", (error, roleRes) => {
      if (error) throw error;
      let roleChoice = [];
      roleRes.forEach(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id
          });
        });
     
      let questions = [
        {
          type: "input",
          name: "first_name",
          message: "Employee's First Name?"
        },
        {
          type: "input",
          name: "last_name",
          message: "Employee's Last Name?"
        },
        {
          type: "list",
          name: "role_id",
          choices: roleChoice,
          message: "Employee's role?"
        },
        {
          type: "list",
          name: "manager_id",
          choices: employeeChoice,
          message: "Who is the Employee's manager?"
        }
      ]
  
      inquirer.prompt(questions)
        .then(response => {
          let query = `INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES (?)`;
          let manager_id = response.manager_id !== 0? response.manager_id: null;
          connection.query(query, [[response.first_name, response.last_name, response.role_id, manager_id]], (error, res) => {
            if (error) throw error;
            console.log(`Added Employee ${response.first_name} ${response.last_name} with id ${res.insertId}`);
            newPrompt();
          });
        })
        .catch(error => {
          console.error(error);
        });
    })
  });
}

//  Change Employee Role

const updateRole = () => {
  
  connection.query("SELECT * FROM EMPLOYEE", (error, employeeRes) => {
    if (error) throw error;
    let employeeChoice = [];
    employeeRes.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
    
     connection.query("SELECT * FROM ROLE", (error, rolRes) => {
      if (error) throw error;
      let roleChoice = [];
      rolRes.forEach(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id
          });
        });
     
      let questions = [
        {
          type: "list",
          name: "id",
          choices: employeeChoice,
          message: "Whose role do you want to update?"
        },
        {
          type: "list",
          name: "role_id",
          choices: roleChoice,
          message: "What is the employee's New Role?"
        }
      ]
  
      inquirer.prompt(questions)
        .then(response => {
          const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
          connection.query(query, [
            {role_id: response.role_id},
            "id",
            response.id
          ], (error, res) => {
            if (error) throw error;
            
            console.log("Updated employee's role!");
            newPrompt();
          });
        })
        .catch(error => {
          console.error(error);
        });
      })
  });
}
      
// Change Employee's Manager":
   const updateManager = ()=> {
  connection.query("SELECT * FROM EMPLOYEE", (error, employeeRes) => {
    if (error) throw err;
    let employeeChoice = [];
    employeeRes.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
    
    const managerChoice = [{
      name: 'None',
      value: 0
    }];

    employeeRes.forEach(({ first_name, last_name, id }) => {
      managerChoice.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
     
    let questions = [
      {
        type: "list",
        name: "id",
        choices: employeeChoice,
        message: "Who do you want to update?"
      },
      {
        type: "list",
        name: "manager_id",
        choices: managerChoice,
        message: "Employee's New Manager?"
      }
    ]
  
    inquirer.prompt(questions)
      .then(response => {
        let query = `UPDATE EMPLOYEE SET ? WHERE id = ?;`;
        let manager_id = response.manager_id !== 0? response.manager_id: null;
        connection.query(query, [
          {manager_id: manager_id},
          response.id
        ], (error, res) => {
          if (error) throw error;
            
          console.log("Updated employee's manager");
          newPrompt();
        });
      })
      .catch(error => {
        console.error(error);
      });
  })
};  

// Delete Department
      
const deleteDepartment = () => {
  let departments = [];
  connection.query("SELECT * FROM DEPARTMENT", (error, res) => {
    if (error) throw error;

    res.forEach(department => {
      let queryObj = {
        name: department.name,
        value: department.id
      }
      departments.push(queryObj);
    });

    let questions = [
      {
        type: "list",
        name: "id",
        choices: departments,
        message: "What Department do you want to Delete?"
      }
    ];

    inquirer.prompt(questions)
    .then(response => {
      let query = `DELETE FROM DEPARTMENT WHERE id = ?`;
      connection.query(query, [response.id], (error, res) => {
        if (error) throw error;
        console.log(`${res.affectedRows} row(s) successfully deleted!`);
        newPrompt();
      });
    })
    .catch(error => {
      console.error(error);
    });
  });
};
//  Delete a Role":
  const deleteRole = () => {
  connection.query("SELECT * FROM ROLE", (error, res) => {
    if (error) throw error;

    const roleChoice = [];
    res.forEach(({ title, id }) => {
      roleChoice.push({
        name: title,
        value: id
      });
    });

    let questions = [
      {
        type: "list",
        name: "id",
        choices: roleChoice,
        message: "What Role do you want to Delete?"
      }
    ];

    inquirer.prompt(questions)
    .then(response => {
      let query = `DELETE FROM ROLE WHERE id = ?`;
      connection.query(query, [response.id], (error, res) => {
        if (error) throw error;
        console.log(`${res.affectedRows} row(s) successfully deleted!`);
        newPrompt();
      });
    })
    .catch(error => {
      console.error(error);
    });
  });
};

// Delete an Employee":
  
const deleteEmployee = () => {
  connection.query("SELECT * FROM EMPLOYEE", (error, res) => {
    if (error) throw error;

    const employeeChoice = [];
    res.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id
      });
    });

    let questions = [
      {
        type: "list",
        name: "id",
        choices: employeeChoice,
        message: "What Employee do you want to Delete?"
      }
    ];

    inquirer.prompt(questions)
    .then(response => {
      let query = `DELETE FROM EMPLOYEE WHERE id = ?`;
      connection.query(query, [response.id], (error, res) => {
        if (error) throw error;
        console.log(`${res.affectedRows}  deleted!`);
        newPrompt();
      });
    })
    .catch(error => {
      console.error(error);
    });
  });
};
 
// Exit the application
function quit() {
  console.log("Goodbye!");
  process.exit();
}
