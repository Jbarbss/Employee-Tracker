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

const startProgram = () => {
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
    .then((val) => {
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
};

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
  );
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
  );
};

var roleArray = [];
const selectRole = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArray.push(res[i].title);
    }
  });
  return roleArray;
};

var managerArray = [];
const selectManager = () => {
  connection.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    (err, res) => {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managerArray.push(res[i].first_name);
      }
    }
  );
  return managerArray;
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter new employee's first name.",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter new employee's last name.",
      },
      {
        name: "role",
        type: "list",
        message: "What is the new employee's role?",
        choices: selectRole(),
      },
      {
        name: "choice",
        type: "rawlist",
        message: "What is their manager's name?",
        choices: selectManager(),
      },
    ])
    .then((val) => {
      var roleID = selectRole().indexOf(val.role) + 1;
      var managerID = selectManager().indexOf(val.choice) + 1;
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerID,
          role_id: roleID,
        },
        (err) => {
          if (err) throw err;
          console.table(val);
          startProgram();
        }
      );
    });
};

const updateEmployee = () => {
  connection.query(
    "SELECT addEmployee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
    (err, res) => {
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: () => {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the employee's last name?",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the employee's new title?",
            choices: selectRole(),
          },
        ])
        .then((val) => {
          var roleID = selectRole().indexOf(val.role) + 1;
          connection.query(
            "UPDATE employee SET WHERE ?",
            {
              last_name: val.lastName,
            },
            {
              role_id: roleID,
            },
            (err) => {
              if (err) throw err;
              console.table(val);
              startProgram();
            }
          );
        });
    }
  );
};

const addRole = () => {
  connection.query(
    "SELECT role.title AS Title, role.Salary AS Salary FROM role",
    (err, res) => {
      inquirer
        .prompt([
          {
            name: "title",
            type: "input",
            message: "What is the new employee's salary?",
          },
        ])
        .then((res) => {
          connection.query(
            "INSERT INTO role SET ?",
            {
              title: res.title,
              salary: res.salary,
            },
            (err) => {
              if (err) throw err;
              console.table(res);
              startProgram();
            }
          );
        });
    }
  );
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What new department would you like to add?",
      },
    ])
    .then((res) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: res.name,
        },
        (err) => {
          if (err) throw err;
          console.table(res);
          startProgram();
        }
      );
    });
};
