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
  database: 'employee_db',
});

connection.connect((err) => {
  if (err) throw err;
//   runSearch();
});

const startTracker = () => {
    inquirer.prompt([{

        name: 'choice',
        type: 'list',
        message: 'Please choose from one of the options below.',
        choices: [
            "View all employees",
            "View all roles",
            "View all departments",
            "Update employee role",
            "Add employee",
            "Add role",
            "Add department"

        ]
    }])

    .then((answer) => {
        switch (answer.choice) {
            case 
            "View all employees":
            viewEmployees()
            break;

            case 
            "View all roles":
            viewRoles()
            break;

            case
            "View all departments":
            viewDepartment()
            break;
            
            case
            "Update employee role":
            updateEmployeeRole()
            break;
            
            case
            "Add employee":
            addEmployee()
            break;
            
            case
            "Add role":
            addRole()
            break;

            case
            "Add department":
            addDepartment()
            break;
        }
    })
};

const viewEmployees = () => {
    connection.query('SELECT * FROM employees'), (err, res) =>{
        if (err) throw err;
        console.log (res);
        console.table(res);
        startTracker();
    }
};

const viewRoles = () => {
    connection.query('SELECT * FROM roles'), (err, res) =>{
        if (err) throw err;
        console.log (res);
        console.table(res);
        startTracker();
    }
};

const viewDepartment = () => {
    connection.query('SELECT * FROM departments'), (err, res) =>{
        if (err) throw err;
        console.log (res);
        console.table(res);
        startTracker();
    }
};