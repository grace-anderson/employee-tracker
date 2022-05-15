# Project: Employee Tracker


[![](https://img.shields.io/badge/License-MIT-brightgreen)](https://opensource.org/licenses/MIT)


## Table of Contents
  - [Project Description](#project-description)
  - [Technologies](#technologies)
  - [Installation and Usage](#installation)
  - [License](#license)
  - [Contribution Guidelines](#contribution-guidelines)
  - [Test Instructions](#test-instructions)
  - [Questions](#questions)
  - [Screenshots](#screenshots)

## Project Description 
The Employee Tracker is a content management system (CMS) that enables non-developers to easily view and interract with information stored in the employees_db database. User scenarios could include a small business or start up which needs manage their employees information. 

Employee Tracker enables users to interract with the database to view, update or delete records via the command line.

Go to [GitHub](https://github.com/grace-anderson/employee-tracker) for the Employee Tracker code.

## Technologies
* JavaScript
* [node](https://nodejs.org/en/)
* [npm inquirer package](https://www.npmjs.com/package/inquirer?activeTab=readme)
* [MySQL](https://www.mysql.com/)
* [figlet](https://www.npmjs.com/package/figlet)

## Installation and Usage
  1. Get the code
      * You need a [GitHub](https://github.com/) account to access the code
      * Install the Employee Tracker by forking the [Employee Tracker GitHub repository](https://github.com/grace-anderson/employee-tracker) and then cloning the fork to locally
      * More information
        * [How to fork a repo](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
        * [GitHub getting started](https://docs.github.com/)
  2. Ready the app
      * Use a command line tool (e.g. Visual Studio) to change directory(cd) into the application's folder
      * Install the necessary packages: `npm install`
      * More information
        * [Getting started with Visual Studio Code](https://code.visualstudio.com/docs/introvideos/basics)
        * [How to install NodeJS](https://coding-boot-camp.github.io/full-stack/nodejs/how-to-install-nodejs)
  3. Set up the database 
     * [Install and create a user account for MySQL](https://coding-boot-camp.github.io/full-stack/nodejs/how-to-install-nodejs)
     * In your command line tool type `mysql -u root -p` . 
     * Then, to create the database schema, type `source schema.sql`
     * If you wish, you can populate or seed the database with test data `source seed.sql`
  4. Then start the app on the command line: `node server.js`
  5. **TO DO** Watch this [video](TO DO) for more detailed instructions. 

## License
License covering this application: [MIT](https://opensource.org/licenses/MIT)

## Contribution Guidelines
* Contributions are welcome.
* You may contribute to the **Employee Tracker** project following the Contribution Guidelines below.
* The code is located in the [Employee Tracker repository](https://github.com/grace-anderson/employee-tracker) 
* To contribute, open a new issue describing your proposed enhancement or fix.
  * Before contributing, browse through the open issues to see if your issue already exists or if there is an issue you might be able to solve. 
  * If you're a newbie dev, start contributing by looking for issues labelled "good first issue"
* It is good practice to set up your project repository as an "upstream" remote and synchronize with the project repository
  * Don't update the main branch. Rather create your own branch using a descriptive brief name
* You can create pull requests, but only admins can review and merge.
  * Be nice to your reviewer by adding adding a plain English explanation of your pull request and how your updates addresses the issue/s or enhancements it concerns
* Also see the [GitHub Community Guidelines](https://docs.github.com/en/site-policy/github-terms/github-community-guidelines)

## Test Instructions
Test using the following User Story and Acceptance Criteria to validate the features of the Employee Tracker.

#### User Story
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business

#### Acceptance Criteria
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

## Questions 
If you have questions about the **Employee Tracker**, feel free to [email](mailto:helen.g.anderson@me.com) the author, Helen Anderson.

See more of Helen Anderson's work on [GitHub](https://github.com/grace-anderson)
