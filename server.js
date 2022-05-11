const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'password123',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

////// db queries
// VIEW queries
// View all departments
app.get('/api/departments', (req, res) => {
  const sql = `SELECT * FROM department`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// View all roles
app.get('/api/roles', (req, res) => {
  const sql = 
    `
    SELECT r.title as 'role_title', r.id as role_id, d.department_name, r.salary
    FROM role r
    LEFT JOIN department d
    ON r.department_id = d.id
    ORDER BY r.id;
    `;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// View all employees
app.get('/api/employees', (req, res) => {
  const sql = 
    `
    SELECT e.id as 'employee_id', e.first_name, e.last_name, r.title as 'job_title', d.department_name as department, r.salary, mgr.first_name as manager_first_name, mgr.last_name as manager_last_name
    FROM employee e
    JOIN role r
    ON e.id = r.id
    JOIN department d
    ON r.department_id = d.id
    LEFT JOIN employee mgr
    on mgr.id = e.manager_id
    order by e.id;
    `;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});


///////////////////////////////////

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });