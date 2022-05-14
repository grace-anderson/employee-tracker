// View all departments 
const mysql = require("mysql2");
const { promptChoice } = require("../server");

// db connection
const connection = mysql.createConnection({
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "password123",
    database: "employees_db",
  });


function viewAllDepartments() {
    connection
      .promise()
      .query("SELECT * FROM department")
      .then(([sql]) => {
        console.log(`\n`);
        console.table(sql);
        console.log(`\n`);
        promptChoice();
      })
      .catch(console.log);
  }
  
  module.exports = viewAllDepartments;
