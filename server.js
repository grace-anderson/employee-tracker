const express = require("express");
// Import and require mysql2, inquirer, console.table
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const figlet = require("figlet");
const res = require("express/lib/response");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

figlet.text(
  "Employee Tracker",
  {
    font: "Digital",
    horizontalLayout: "default",
    verticalLayout: "full",
    width: 100,
    whitespaceBreak: true,
  },
  function (err, data) {
    if (err) {
      console.log(`Employee Tracker header didn't load`);
      console.dir(err);
      return;
    }
    console.log(data);
  }
);

const connection = mysql.createConnection({
  host: "localhost",
  // MySQL username,
  user: "root",
  // MySQL password
  password: "password123",
  database: "employees_db",
});
connection
  .promise()
  .query("SELECT 1")
  .then(() => {
    promptChoice();
  })
  .catch(console.log);
// .then(() => connection.end());

//prompt questions
function promptChoice() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit"
        ],
      },
    ])
    //TODO functions in each choice
    .then((selection) => {
      switch (selection.choice) {
        case "View all departments":
          viewAllDepartments();
          break;

        case "View all roles":
          viewAllRoles();
          break;

        case "View all employees":
          viewAllEmployees();
          break;

        case "Add a department":
          addDepartment();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Update an employee role":
          updateEmployeeRole();
          break;

        case "Exit":
          connection.end();
          break;
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}

// READ
// View all departments
function viewAllDepartments() {
  connection
    .promise()
    .query("SELECT * FROM department")
    .then(([sql]) => {
      console.log(` `);
      console.table(sql);
      promptChoice();
    })
    .catch(console.log)
    // .then(() => connection.end());
}

// View all roles
function viewAllRoles() {
  connection
    .promise()
    .query(`
    SELECT r.title as 'role_title', r.id as role_id, d.department_name, r.salary
    FROM role r
    LEFT JOIN department d
    ON r.department_id = d.id
    ORDER BY r.id;
    `)
    .then(([sql]) => {
      console.log(` `);
      console.table(sql);
      promptChoice();
    })
    .catch(console.log)
    // .then(() => connection.end());
}

// View all employees
function viewAllEmployees() {
  connection
    .promise()
    .query(`
    SELECT e.id as 'employee_id', e.first_name, e.last_name, r.title as 'job_title', d.department_name as department, r.salary, mgr.first_name as manager_first_name, mgr.last_name as manager_last_name
    FROM employee e
    JOIN role r
    ON e.id = r.id
    JOIN department d
    ON r.department_id = d.id
    LEFT JOIN employee mgr
    on mgr.id = e.manager_id
    order by e.id;
    `)
    .then(([sql]) => {
      console.log(` `);
      console.table(sql);
      promptChoice();
    })
    .catch(console.log)
    // .then(() => connection.end());
}

// CREATE
// insert department
app.post("/api/new-department", ({ body }, res) => {
  const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
  const params = [body.department_name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
    });
  });
});

//insert role
app.post("/api/new-role", ({ body }, res) => {
  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
  const params = [body.title, body.salary, body.department_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
    });
  });
});

//insert employee
app.post("/api/new-employee", ({ body }, res) => {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
  const params = [
    body.first_name,
    body.last_name,
    body.role_id,
    body.manager_id,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
    });
  });
});

//UPDATE
//update employee role
app.put("/api/employee/:id", (req, res) => {
  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  const params = [req.params.role_id, req.body.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "Employee not found",
      });
    } else {
      res.json({
        message: "success",
        data: req.body,
        changes: result.affectedRows,
      });
    }
  });
});

///////////////////////////////////

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});
