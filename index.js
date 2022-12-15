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
        viewAll("EMPLOYEE");
        break;
      case 'View All Roles':
        viewAll("ROLE");
        break;
      case 'View All Departments':
        viewAll("DEPARTMENT");
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
  .catch(err => {
    console.error(err);
  });
}
  





// Exit the application
function quit() {
  console.log("Goodbye!");
  process.exit();
}
