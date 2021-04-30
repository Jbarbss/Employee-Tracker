const mysql = require('mysql');
const inquirer = require('inquirer');
const consTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'password',
  database: 'employee_tracker_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Server is Live")
  console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
  runSearch();
});

function startProgram() {
  inquirer.prompt([
    {
      type: 'choice',
      type: 'list',
      message: 'Please choose from one of the following options',
      choices: [
        "View All Employees",
        "View All Employees by Roles",
        "View All Employees by Department",
        "Update Employee",
        "Add Employee",
        "Add Role",
        "Add Department"
        
      ]
    }
  ])
  .then(function(val) {
    switch (val.choice) {
      case  "View All Employees":
        viewEmployees();
      break;

      case  "View All Employees by Roles":
        viewRoles();
      break;

      case  "View All Employees by Department":
        viewDepartments();
      break;

      case  "Update Employee":
        updateEmployee();
      break;

      case  "Add Employee":
        addEmployee();
      break;

      case  "Add Role":
        addRole();
      break;
      
      case  "Add Department":
        addDepartment();
      break;


    }  
  })
}