// Import and require necessary packages
const mysql = require('mysql2');
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Bullhorn4?!@#12",
  database: "employeetracker_db"
});

// Error handling and console log to ensure connection exits
db.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to the employeetracker_db database.`)
  startApp();
});

// Create a function, rather than exporting a module, so it comes back here as square 1
function startApp() {
  inquirer.prompt([{
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Exit"
      ]
    }])
    .then(function (answer) {
      switch (answer.choice) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployee();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Exit":
          db.end();
          break;
      }
    });
}

// Series of follow up functions with additional prompts based on user's intial answer to "What would you like to do?"

// viewAllEmployees() -- DONE
function viewAllEmployees() {
  db.query(
    "SELECT employee.employee_id, employee.first_name, employee.last_name, roles.title, roles.salary, department.name, manager_id FROM employee INNER JOIN roles ON employee.roles_id = roles.roles_id INNER JOIN department ON roles.department_id = department.department_id;",

    function (err, res) {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
};

// viewAllDepartments() -- DONE
function viewAllDepartments() {
  console.log("viewAllDepartments function has been triggered")
  db.query(
    "SELECT * FROM department;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
};

// viewAllRoles() -- DONE
function viewAllRoles() {
  console.log("viewAllRoles function has been triggered")
  db.query(
    "SELECT * FROM roles;",

    function (err, res) {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
};

// addEmployee() -- DONE
function addEmployee() {
  db.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    console.log(res)
    const roles = res.map(element => element.title)
    inquirer.prompt([{
      name: "first_name",
      type: "input",
      message: "What's the employee's first name?",
    }, {
      name: "last_name",
      type: "input",
      message: "What's the employee's last name?",
    }, {
      name: "roles",
      type: "list",
      message: "What is the title of their role?",
      choices: roles
    }]).then(answers => {
      console.log("roles", answers.roles);
      const chosenRole = res.find(element => {
        return element.title === answers.roles
      });
      console.log(chosenRole.roles_id);
      const newEmployee = {
        first_name: answers.first_name,
        last_name: answers.last_name,
        roles_id: chosenRole.roles_id
      };
      db.query(`INSERT INTO employee (first_name, last_name, roles_id) VALUES ('${answers.first_name}', '${answers.last_name}', '${chosenRole.roles_id}');`, (err, success) => {
        console.log(`${newEmployee.first_name}, ${newEmployee.last_name}, ${chosenRole.roles_id} has successfully been added to the employee database.`);
        startApp();
      });

    })

  })

};

// addDepartment() -- DONE
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      message: "What would you like to name the new department?",
      name: "department"
    })
    .then(function (answer) {
      console.log(answer.department);
      db.query("INSERT INTO department SET ?", {
          name: answer.department,
        },
        function (err, res) {
          if (err) throw err;
          startApp();
        });
    });
};

// addRole() -- DONE
function addRole() {
  console.log("addRole function has been triggered");
  var questions = [{
      type: "input",
      message: "What type of role would you like to add?",
      name: "title"
    },
    {
      type: "input",
      message: "What is the salary for this role?",
      name: "salary"
    },
    {
      type: "input",
      message: "In what department is the new role?",
      name: "department_id"
    }

  ];
  inquirer.prompt(questions).then(function (answer) {
    db.query(
      "INSERT INTO roles SET ?", {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.department_id

      },
      function (error, res) {
        if (error) throw error;
        console.log("New role added successfully");
        startApp();
      }
    );
  });
};

// TODO: updateEmployee()
function updateEmployee() {
  console.log("updateEmployee function has been triggered");

  // 1) First... select an employee to update by querying the database for all employees:
  db.query(
    "SELECT employee.employee_id, employee.first_name, employee.last_name, roles.title, roles.salary, department.name, manager_id FROM employee INNER JOIN roles ON employee.roles_id = roles.roles_id INNER JOIN department ON roles.department_id = department.department_id;",

    function (err, res) {
      if (err) throw err;
      // 2) Create a variable that will combine the first and last names together and base it on employee_id
      let employeeChoices = res.map((employee) => ({
        name: employee.first_name + ' ' + employee.last_name,
        value: employee.employee_id
      }))
      // 3) Use Inquirer to have the user select one of the employees
      inquirer
        .prompt({
          type: "list",
          message: "What is the first name of the employee you would like to access?",
          name: "id",
          choices: employeeChoices
        }) //END prompt
        .then(function (answer) {
            console.log(answer.id);
            // 4) Query our database for all roles (again)
            db.query(
              "SELECT employee.employee_id, employee.first_name, employee.last_name, employee.roles_id, roles.title, roles.salary, department.name, manager_id FROM employee INNER JOIN roles ON employee.roles_id = roles.roles_id INNER JOIN department ON roles.department_id = department.department_id;",

              function (err, res) {
                if (err) throw err;
                console.log(res);
                // 5) THIS!!! This is the variable that effed me up. So rather than setting it up how I had it initially, I really only want to search for the roles_id... I don't need the other stuff yet
                let roleChoices = res.map((employee) => employee.roles_id);

                // 6) Use Inquirer to have the user select a role from the list
                inquirer
                  .prompt({
                    type: "list",
                    message: "Which role would you like to select?",
                    name: "id",
                    choices: roleChoices
                  }) //END prompt
                  // Store the answer from that previously asked question (ans2) to use in the UPDATE query
                  .then(function (ans2) {
                    
                    console.log("The current roleChoices are: " + roleChoices);

                    // NOTE: ans2 is the stored response from the "Which role would you like to select" prompt, and answer is the stored response for the selected employee prompt
                    db.query("UPDATE employee SET roles_id = ? WHERE employee_id = ?", [ans2.id, answer.id]);

                    // Go back to the original line of questioning
                    startApp();
                  
                  }) //end THEN

              }) // end function (err,res)
          },

        ); // END then (answer...)

    })
};