const { prompt } = require("inquirer");
const db = require("./db");
require("console.table");

init();

// Display logo text, load main prompts
function init() {
  // loadPrompts();
   const Questions = [{
    type: "list",
    name: "action",
    message: "What would you like to do?",
    loop: false,
    choices: ["View Employees", "View Roles", "View Departments", "Add Employee", "Add Role", "Add Department", "Change Employee Role", "Change Employee's Manager", "View Employees by Manager", "Delete Department", "Delete a Role", "Delete an Employee", "View the Budget of a Department", "Quit"]
  }]
  
  inquier.prompt(startQuestion)
  .then(response => {
    switch (response.action) {
      case "View Employees":
        viewAll("EMPLOYEE");
        break;
      case "View Roles":
        viewAll("ROLE");
        break;
      case "View Departments":
        viewAll("DEPARTMENT");
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
      case "View Employees by Manager":
        viewEmployeeByManager();
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
      case "View the Budget of a Department":
        viewBudget();
        break;
      case "Quit":
        quit();
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
