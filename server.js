// Import and require mysql2, inquirer
// Console.table not imported as Javascript has built in functionality: console.table()
const mysql = require("mysql2");
const inquirer = require("inquirer");
const figlet = require("figlet");
// const cTable = require("console.table");

//require local modules
const requiredQuestions = require("./src/requiredQuestions");
const { validateNumber } = require("./src/validateNumber");

//create employee tracker heading
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

// db connection
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
    //trigger questions prompt
    promptChoice();
  })
  .catch(console.log);

// prompt questions
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
          "View employees by manager",
          "View employees by department",
          "View a department's total utilised budget",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee's role",
          "Update an employee's manager",
          "Delete a department",
          "Delete a role",
          "Delete an employee",
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

        case "View employees by manager":
          viewEmployeesbyManager();
          break;

        case "View employees by department":
          viewEmployeesByDepartment();
          break;

        case "View a department's total utilised budget":
          viewTotalUtilisedBudget();
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

        case "Update an employee's role":
          updateEmployeeRole();
          break;

        case "Update an employee's manager":
          updateEmployeeManager();
          break;

        case "Delete a department":
          deleteDepartment();
          break;

        case "Delete a role":
          deleteRole();
          break;

        case "Delete an employee":
          deleteEmployee();
          break;

        case "Exit":
          process.exit();
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

// View all departments
function viewAllDepartments() {
  connection
    .promise()
    .query(
      `
      SELECT id, department_name AS 'Department'
      FROM department
      ORDER BY department_name
      `
    )
    .then(([sql]) => {
      console.log(`\n`);
      console.table(sql);
      console.log(`\n`);
      promptChoice();
    })
    .catch(console.log);
}

// View all roles
function viewAllRoles() {
  connection
    .promise()
    .query(
      `
    SELECT r.id, r.title AS 'Role',  d.department_name AS 'Department', r.salary AS 'Salary'
    FROM role r
    LEFT JOIN department d
    ON r.department_id = d.id
    ORDER BY r.title;
    `
    )
    .then(([sql]) => {
      console.log(`\n`);
      console.table(sql);
      console.log(`\n`);
      promptChoice();
    })
    .catch(console.log);
}

// View all employees
function viewAllEmployees() {
  const query = `
  SELECT 
	e.id,
  e.first_name AS 'First Name',
  e.last_name AS 'Last Name',
  r.title AS 'Role',
  department_name AS 'Department',
  concat(mgr.first_name, " ", mgr.last_name) as 'Manager'
  FROM employee e
  JOIN role r
  ON r.id = e.role_id
  JOIN department d
  ON r.department_id = d.id
  LEFT JOIN employee mgr
  ON mgr.id  = e.manager_id
  order by e.first_name
`;
  connection
    .promise()
    .query(query)
    .then(([sql]) => {
      console.log(`\n`);
      console.table(sql);
      console.log(`\n`);
      promptChoice();
    })
    .catch(console.log);
}

// View employees by manager
const viewEmployeesbyManager = () => {
  connection.query(
    `
    SELECT m.id, m.first_name, m.last_name
    FROM employee e
    LEFT JOIN employee m
    ON m.id  = e.manager_id
    WHERE m.id IS NOT NULL
    GROUP by m.id
    ORDER BY m.first_name;
    `,
    (err, managers) => {
      if (err) throw err;
      const managerList = [
        {
          name: "No manager",
          value: 0,
        },
      ];

      managers.forEach(({ first_name, last_name, id }) => {
        managerList.push({
          name: first_name + " " + last_name,
          value: id,
        });
      });

      let questions = [
        {
          type: "list",
          name: "manager_id",
          choices: managerList,
          message: "Choose a manager to see their employees",
        },
      ];

      inquirer.prompt(questions).then((response) => {
        let manager_id, query;
        if (response.manager_id) {
          query = `
          SELECT 
          e.first_name AS 'First Name',
          e.last_name AS 'Last Name',
          CONCAT(m.first_name, " ", m.last_name) AS Manager
          FROM employee e
          LEFT JOIN employee m ON e.manager_id = m.id
          WHERE e.manager_id = ?
          ORDER BY e.first_name;
          `;
        } else {
          //handle where employee has no manager (id and name is null)
          manager_id = null;
          query = `
          SELECT 
          e.first_name AS 'First Name',
          e.last_name AS 'Last Name',
          CONCAT(m.first_name, " ", m.last_name) AS Manager
          FROM employee e
          LEFT JOIN employee m ON e.manager_id = m.id
          WHERE e.manager_id = IS NULL
          ORDER BY e.first_name;
          `;
        }
        connection.query(query, [response.manager_id], (err, res) => {
          if (err) throw err;
          console.log(`\n`);
          console.table(res);
          console.log(`\n`);
          promptChoice();
        });
      });
    }
  );
};

// view employees by department
const viewEmployeesByDepartment = () => {
  connection.query(
    `
    SELECT *
    FROM department
    WHERE id IS NOT NULL;
    `,
    (err, departments) => {
      if (err) throw err;
      const departmentList = [
        {
          name: "No department",
          value: 0,
        },
      ];

      departments.forEach(({ department_name, id }) => {
        departmentList.push({
          name: department_name,
          value: id,
        });
      });

      let questions = [
        {
          type: "list",
          name: "department_id",
          choices: departmentList,
          message: "Choose a department to see its employees",
        },
      ];

      inquirer.prompt(questions).then((response) => {
        let department_id, query;
        if (response.department_id) {
          query = `
          SELECT e.first_name AS 'First Name', e.last_name AS 'Last Name', department_name AS 'Department'
          FROM employee as e
          JOIN role r
          on r.id = e.role_id
          JOIN department d
          on r.department_id = d.id
          where r.department_id = ?
          ORDER BY e.first_name;
          `;
        } else {
          //where employee has no department (e.g. when department deleted)
          department_id = null;
          query = `
          SELECT e.first_name AS 'First Name', e.last_name AS 'Last Name', department_name AS 'Department'
          FROM employee as e
          JOIN role r
          on r.id = e.role_id
          JOIN department d
          on r.department_id = d.id
          where r.department_id IS NULL
          ORDER BY e.first_name;
          `;
        }
        connection.query(query, [response.department_id], (err, res) => {
          if (err) throw err;
          console.log(`\n`);
          console.table(res);
          console.log(`\n`);
          promptChoice();
        });
      });
    }
  );
};

// view total utilised budget
const viewTotalUtilisedBudget = () => {
  connection.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err;

    const departmentList = [];
    res.forEach(({ department_name, id }) => {
      departmentList.push({
        name: department_name,
        value: id,
      });
    });

    let questions = [
      {
        type: "list",
        name: "id",
        choices: departmentList,
        message: "Select department to see its total utlised budget",
      },
    ];

    inquirer.prompt(questions).then((response) => {
      const query = `
        SELECT department_name AS 'Department',
        SUM(salary) as 'Total Utilised Budget'
        FROM employee as e
        JOIN role r
        ON r.id = e.role_id
        JOIN department d
        ON r.department_id = d.id
        WHERE department_id = ?
      `;
      connection.query(query, [response.id], (err, res) => {
        if (err) throw err;
        console.log(`\n`);
        console.table(res);
        console.log(`\n`);
        promptChoice();
      });
    });
  });
};

// add department
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
      console.log(`\n${response.addDepartment} department added.\n`);
      promptChoice();
    }
  );
};

//add role
const addRole = async () => {
  const departmentList = [];
  connection.query(`SELECT * FROM department`, (err, res) => {
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
      console.log(`\n${response.title} role added.\n`);
      promptChoice();
    }
  );
};

//add employee
const addEmployee = async () => {
  const roleList = [];
  connection.query(`SELECT id, title FROM role`, (err, res) => {
    if (err) throw err;

    res.forEach((role) => {
      let roleObject = {
        name: role.title,
        value: role.id,
      };

      roleList.push(roleObject);
    });
  });

  const managerList = [];
  connection.query(
    `
    SELECT id, first_name, last_name FROM EMPLOYEE ORDER BY last_name
    `,
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

//update employee role
const updateEmployeeRole = () => {
  connection.query(
    `SELECT * FROM employee ORDER BY first_name`,
    (err, employees) => {
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

        inquirer.prompt(questions).then((response) => {
          const query = `UPDATE employee SET ? WHERE ?? = ?;`;
          connection.query(
            query,
            [{ role_id: response.role_id }, "id", response.id],
            (err, res) => {
              if (err) throw err;
              console.log("\nEmployee's role updated\n");
              promptChoice();
            }
          );
        });
      });
    }
  );
};

//update employee manager
const updateEmployeeManager = () => {
  connection.query(
    `SELECT * FROM employee ORDER BY first_name`,
    (err, employees) => {
      if (err) throw err;
      const employeeList = [];
      employees.forEach(({ first_name, last_name, id }) => {
        employeeList.push({
          name: first_name + " " + last_name,
          value: id,
        });
      });

      let questions = [
        {
          type: "list",
          name: "id",
          choices: employeeList,
          message: "Select an employee to update their manager",
        },
        {
          type: "list",
          name: "manager_id",
          choices: employeeList,
          message: "Select the employee's new manager",
        },
      ];

      inquirer.prompt(questions).then((response) => {
        const query = `UPDATE employee SET ? WHERE ?? = ?;`;
        connection.query(
          query,
          [{ manager_id: response.manager_id }, "id", response.id],
          (err, res) => {
            if (err) throw err;
            console.log(`\nEmployee's manager updated\n`);
            promptChoice();
          }
        );
      });
    }
  );
};

//delete department
const deleteDepartment = () => {
  const departments = [];
  connection.query(
    `SELECT * FROM department ORDER BY department_name`,
    (err, res) => {
      if (err) throw err;

      res.forEach((department) => {
        let departmentObject = {
          name: department.department_name,
          value: department.id,
        };
        departments.push(departmentObject);
      });

      let questions = [
        {
          type: "list",
          name: "id",
          choices: departments,
          message: "Choose a department to delete",
        },
      ];

      inquirer.prompt(questions).then((response) => {
        const query = `DELETE FROM department WHERE id = ?`;
        connection.query(query, [response.id], (err, res) => {
          if (err) throw err;
          console.log(`\nDepartment deleted\n`);
          promptChoice();
        });
      });
    }
  );
};

//delete role ///////////////////////////////////////
const deleteRole = () => {
  const roles = [];
  connection.query("SELECT * FROM role ORDER BY title", (err, res) => {
    if (err) throw err;

    res.forEach((role) => {
      let roleObject = {
        name: role.title,
        value: role.id,
      };
      roles.push(roleObject);
    });

    let questions = [
      {
        type: "list",
        name: "id",
        choices: roles,
        message: "Choose the role to delete",
      },
    ];

    inquirer.prompt(questions).then((response) => {
      const query = `DELETE FROM role WHERE id = ?`;
      connection.query(query, [response.id], (err, res) => {
        if (err) throw err;
        console.log(`\nRole deleted\n`);
        promptChoice();
      });
    });
  });
};

//delete role ////////////////////////////////////////
const deleteEmployee = () => {
  const employees = [];
  connection.query("SELECT * FROM employee ORDER BY first_name", (err, res) => {
    if (err) throw err;

    res.forEach((employee) => {
      let employeeObject = {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
      employees.push(employeeObject);
    });

    let questions = [
      {
        type: "list",
        name: "id",
        choices: employees,
        message: "Choose the employee to delete",
      },
    ];

    inquirer.prompt(questions).then((response) => {
      const query = `DELETE FROM employee WHERE id = ?`;
      connection.query(query, [response.id], (err, res) => {
        if (err) throw err;
        console.log(`\nEmployee deleted\n`);
        promptChoice();
      });
    });
  });
};
