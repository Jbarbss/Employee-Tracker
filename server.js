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
          "Update Employee Manager",
          "Update Employee Role",
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

        case "Update Employee Manager":
          updateEmployeeManager();
          break;
          
          case "Update Employee Role":
          updateEmployeeRole();
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

// function to view all departments

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

// function to view all roles

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


// function to add employees
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

// function to update employees

const updateEmployeeRole = () => {
  connection.query("SELECT * FROM role", (err, role) => {
    if (err) throw err;
    let newRoles = role.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    connection.query("SELECT * FROM employee", (err, employees) => {
      if (err) throw err;
      let newEmployee = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
      inquirer
        .prompt([
          {
            name: "employee",
            type: "rawlist",
            message: "Which employee do you want to update?",
            choices: newEmployee,
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the employees new role?",
            choices: newRoles,
          },
        ])
        .then((answer) => {
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: answer.role,
              },
              {
                id: answer.employee,
              },
            ],
            (err, res) => {
              if (err) throw err;
              console.log("New Role Updated!\n");
             
              startProgram();
            }
          );
        });
    });
  });
};

// function to update employee manager

const updateEmployeeManager = () => {
connection.query("SELECT * FROM employee", (err, managers) => {
  if (err) throw err;
  let newManagers = managers.map((manager) => ({
    name: `${manager.first_name} ${manager.last_name}`,
    value: manager.id,
  }));

  connection.query("SELECT * FROM employee", (err, employees) => {
    if (err) throw err;
    let newEmployee = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    inquirer
      .prompt([
        {
          name: "employee",
          type: "rawlist",
          message: "Which employee do you want to update?",
          choices: newEmployee,
        },
        {
          name: "manager",
          type: "rawlist",
          message: "What is the employees new manager?",
          choices: newManagers,
        },
      ])
      .then((answer) => {
        // console.log(answer.manager, answer.employee );
        connection.query(
          "UPDATE employee SET ? WHERE ?",
          [
            {
              manager_id: answer.manager,
            },
            {
              id: answer.employee,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.log('new manager inserted!\n');
            console.table(res);
            // Call start AFTER the INSERT completes
            startProgram();
          }
        );
      });
  });
});
};

// function to add role
const addRole = () => {
  connection.query("SELECT * FROM department", (err, department) => {
    if (err) throw err;
    let newDepartment = department.map((department) => ({
      name: `${department.name}`,
      value: department.id,
    }));
    inquirer
      .prompt([
        {
          name: "roleName",
          type: "input",
          message: "Please enter your Role name.",
        },
        {
          name: "salary",
          type: "input",
          message: "Please enter salary.",
        },
        {
          name: "department",
          type: "rawlist",
          message: "What department is your role in?",
          choices: newDepartment,
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.roleName,
            salary: answer.salary,
            department_id: answer.department,
          },

          (err, res) => {
            if (err) throw err;
            console.log('New Role Created!\n');
           
            startProgram();
          }
        );
      });
  });
};

// function to add department

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
          console.log('New Department Created!\n')
          console.table(res);
          startProgram();
        }
      );
    });
};
