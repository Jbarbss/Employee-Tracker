const mysql = require("mysql");
const inquirer = require("inquirer");
const consTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // port 3306
  port: 3306,

  //username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: "password",
  database: "employee_tracker_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Server is Live");
  console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
  startProgram();
});

// starting program with prompt

function startProgram() {
  inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        message: "Please choose from one of the following options",
        choices: [
          "View All Employees",
          "View All Employees by Roles",
          "View All Employees by Department",
          "Update Employee",
          "Add Employee",
          "Add Role",
          "Add Department",
        ],
      },
    ])
    .then(function (val) {
      switch (val.choice) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View All Employees by Roles":
          viewRoles();
          break;

        case "View All Employees by Department":
          viewDepartments();
          break;

        case "Update Employee":
          updateEmployee();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Department":
          addDepartment();
          break;
      }
    });
}

// function to view all employees

const viewEmployees = () => {
  console.log("-----------------");
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startProgram();
    }
  );
};

const viewDepartments = () => {
  console.log("-----------------");
    connection.query(
      "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",     
      (err, res) => {
      if (err) throw err;
      console.table(res);
      startProgram();
      }
    )
  };


  const viewRoles = () => {
    console.log("-----------------");
      connection.query(
        "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
        (err, res) => {
        if (err) throw err;
        console.table(res);
        startProgram();
        }
      )
    };



