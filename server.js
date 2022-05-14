const express = require("express");
// Import and require mysql2, inquirer, console.table
const mysql = require("mysql2");
const inquirer = require("inquirer");
// const cTable = require("console.table");
const figlet = require("figlet");
const res = require("express/lib/response");

const PORT = process.env.PORT || 3001;
const app = express();

//require local modules
const requiredQuestions = require("./src/requiredQuestions");
const { validateNumber } = require("./src/validateNumber");

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
    console.log(`\n`);
  }
);

// Db connection //////////////////////////////////////////////////////
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

//prompt questions, link to question functions ////////////////////////
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
          "Exit",
        ],
      },
    ])
    //user choice triggers function
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
          process.exit();
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

// View all departments ///////////////////////////////////////////////
function viewAllDepartments() {
  connection
    .promise()
    .query("SELECT * FROM department")
    .then(([sql]) => {
      console.log(`\n`);
      console.table(sql);
      promptChoice();
    })
    .catch(console.log);
  // .then(() => connection.end());
}

// View all roles /////////////////////////////////////////////////
function viewAllRoles() {
  connection
    .promise()
    .query(
      `
    SELECT r.title as 'role_title', r.id as role_id, d.department_name, r.salary
    FROM role r
    LEFT JOIN department d
    ON r.department_id = d.id
    ORDER BY r.id;
    `
    )
    .then(([sql]) => {
      console.log(` `);
      console.table(sql);
      promptChoice();
    })
    .catch(console.log);
  // .then(() => connection.end());
}

// View all employees ///////////////////////////////////////////////////
function viewAllEmployees() {
  // const original = ` SELECT e.id as 'employee_id', e.first_name, e.last_name, r.title as 'job_title', d.department_name as department, r.salary, mgr.first_name as manager_first_name, mgr.last_name as manager_last_name
  // FROM employee as e
  // JOIN role as r
  // ON e.id = r.id
  // JOIN department d
  // ON r.department_id = d.id
  // LEFT JOIN employee mgr
  // on mgr.id = e.manager_id
  // order by e.id;`

  const query = `
  SELECT 
	e.id as 'id',
  e.first_name as 'First Name',
  e.last_name as 'Last Name',
  role.title as 'Role',
  department_name as 'Department',
  concat(employee.first_name, " ", employee.last_name) as 'Manager'
  FROM employee as e
  JOIN \`role\`
  on role.id = e.role_id
  JOIN \`department\`
  on role.department_id = department.id
  LEFT JOIN employee 
  on employee.id  = e.manager_id;
`;
  connection
    .promise()
    .query(query)
    .then(([sql]) => {
      console.log(`\n`);
      console.table(sql);
      promptChoice();
    })
    .catch(console.log);
  // .then(() => connection.end());
}

// insert department ///////////////////////////////////////////////////
const addDepartment = async () => {
  const response = await inquirer.prompt([
    {
      name: "addDepartment",
      type: "input",
      message: `What is name of the department? `,
      validate: requiredQuestions("Department name is required"),
    },
  ]);

  connection.query(
    "INSERT INTO department SET ?",
    {
      department_name: response.addDepartment,
    },
    (err) => {
      if (err) throw err;
      console.log(`${response.addDepartment} department added.`);
      promptChoice();
    }
  );
};

//insert role /////////////////////////////////////////////////////////
const addRole = async () => {
  //create list for user to select department
  const departmentList = [];
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;

    res.forEach((department) => {
      let departmentObject = {
        name: department.department_name,
        value: department.id,
      };

      departmentList.push(departmentObject);
    });
  });

  const response = await inquirer.prompt([
    // prompt user input role title, salary, department
    {
      name: "title",
      type: "input",
      message: `What is the role's title?`,
      validate: requiredQuestions("Title is required"),
    },
    {
      name: "salary",
      type: "input",
      message: `What is the role's salary?`,
      validate: requiredQuestions("Department name is required"),
      validate: validateNumber,
    },
    {
      type: "list",
      name: "department",
      choices: departmentList,
      message: "Select the role's department",
      validate: requiredQuestions("The role's department is required"),
    },
  ]);

  connection.query(
    "INSERT INTO role SET ?",
    {
      title: response.title,
      salary: response.salary,
      department_id: response.department,
    },
    (err) => {
      if (err) throw err;
      console.log(`${response.title} role added.`);
      promptChoice();
    }
  );
};

//add employee /////////////////////////////////////////
const addEmployee = async () => {
  //create list for user to select role
  const roleList = [];
  connection.query("SELECT id, title FROM role", (err, res) => {
    if (err) throw err;

    res.forEach((role) => {
      let roleObject = {
        name: role.title,
        value: role.id,
      };

      roleList.push(roleObject);
    });
  });

  // create list for user to select employee's manager
  const managerList = [];
  connection.query(
    "SELECT id, first_name, last_name FROM EMPLOYEE ORDER BY last_name",
    (err, res) => {
      if (err) throw err;

      res.forEach((manager) => {
        let managerObject = {
          name: manager.first_name + " " + manager.last_name,
          value: manager.id,
        };

        managerList.push(managerObject);
      });
      let nullObject = {
        name: "No manager",
        value: null,
      };

      managerList.push(nullObject);
    }
  );

  const response = await inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: `What is the employee's first name?`,
      validate: requiredQuestions("First name is required"),
    },
    {
      name: "last_name",
      type: "input",
      message: `What is the employee's last name?`,
      validate: requiredQuestions("Last name is required"),
    },
    {
      type: "list",
      name: "role",
      choices: roleList,
      message: "Select the employee's role",
      validate: requiredQuestions("Role is required"),
    },
    {
      type: "list",
      name: "manager",
      choices: managerList,
      message: "Select the employee's manager or select 'No manager'",
    },
  ]);

  await connection.promise().query("INSERT INTO employee SET ?", {
    first_name: response.first_name,
    last_name: response.last_name,
    role_id: response.role,
    manager_id: response.manager,
  });
  console.log(
    `\n${response.first_name} ${response.last_name} added to employees.\n`
  );
  return promptChoice();
};

const updateEmployeeRole = () => {
  connection.query("SELECT * FROM employee ORDER BY first_name", (err, employees) => {
    if (err) throw err;
    const employeeList = [];
    employees.forEach(({ first_name, last_name, id }) => {
      employeeList.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });

    connection.query("SELECT * FROM role", (err, roles) => {
      if (err) throw err;
      const roleList = [];
      roles.forEach(({ title, id }) => {
        roleList.push({
          name: title,
          value: id,
        });
      });

      let questions = [
        {
          type: "list",
          name: "id",
          choices: employeeList,
          message: "Select an employee to update their role",
        },
        {
          type: "list",
          name: "role_id",
          choices: roleList,
          message: "Select the employee's new role",
        },
      ];

      inquirer
        .prompt(questions)
        .then((response) => {
          const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
          connection.query(
            query,
            [{ role_id: response.role_id }, "id", response.id],
            (err, res) => {
              if (err) throw err;

              console.log("\nEmployee's role updated\n");
              promptChoice();
            }
          );
        })
    });
  });
};

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});
