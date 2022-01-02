//Add dependencies
const inquirer = require("inquirer")
const mysql = require("mysql2")
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "enterYourPW",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    startPrompt();
});

//Series of prompts in CLI
function startPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "View all Departments?",
                "View all Roles?",
                "View all Employees?",
                "Add a Department?",
                "Add a Role?",
                "Add an Employee?",
                "Update an Employee Role?"
            ]
        }
    ]).then(function (val) {
        switch (val.choice) {
            case "View all Departments?":
                viewAllDepartments();
                break;

            case "View all Roles?":
                viewAllRoles();
                break;

            case "View all Employees?":
                viewAllEmployees();
                break;

            case "Add a Department?":
                addDepartment();
                break;

            case "Add a Role?":
                addRole();
                break;

            case "Add an Employee?":
                addEmployee();
                break;

            case "Update an Employee Role?":
                updateEmployee();
                break;
        }
    })
}

//This was added to help select a role in the CLI
var roleArr = [];
function selectRole() {
    connection.query("SELECT id FROM role order by id", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].id);
        }
    })
    return roleArr;
}

//This was added to help select a department in the CLI
var deptArr = [];
function selectDepartment() {
    connection.query("SELECT id, name FROM department", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            deptArr.push(res[i].id);
        }
    })
    return deptArr;
}

//This was added to help select a employee/manager in the CLI
var employeeArr = [];
function selectEmployee() {
    connection.query("SELECT id FROM employee", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            employeeArr.push(res[i].id);
        }
    })
    return employeeArr;
}

function viewAllDepartments() {
    connection.query("SELECT department.name AS DepartmentName, department.id AS DepartmentID FROM department;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}

function viewAllRoles() {
    connection.query("SELECT role.title AS JobTitle, role.id, department.name as DepartmentName, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}

function viewAllEmployees() {
    connection.query("SELECT employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS JobTitle, role.salary AS Salary, department.name AS DepartmentName, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}

function addDepartment() {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What Department would you like to add?"
        }
    ]).then(function (res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
                name: res.name
            },
            function (err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
}

function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function (err, res) {
        inquirer.prompt([
            {
                name: "Title",
                type: "input",
                message: "What is the roles Title?"
            },
            {
                name: "Salary",
                type: "input",
                message: "What is the Salary?"
            },
            {
                name: "Department",
                type: "list",
                message: "What is their department? ",
                choices: selectDepartment()
            },
        ]).then(function (res) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: res.Title,
                    salary: res.Salary,
                    department_id: res.Department
                },
                function (err) {
                    if (err) throw err
                    console.table(res);
                    startPrompt();
                }
            )

        });
    });
}

function addEmployee() {
    connection.query("SELECT * from employee", function (err, res) {
        inquirer.prompt([
            {
                name: "firstname",
                type: "input",
                message: "Enter their first name"
            },
            {
                name: "lastname",
                type: "input",
                message: "Enter their last name"
            },
            {
                name: "role",
                type: "list",
                message: "What is their role?",
                choices: selectRole()
            },
            {
                name: "manager",
                type: "list",
                message: "Who will be the manager?",
                choices: selectEmployee()
            },
        ]).then(function (res) {
            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: res.firstname,
                    last_name: res.lastname,
                    manager_id: res.manager,
                    role_id: res.role
                },
                function (err) {
                    if (err) throw err
                    console.table(res);
                    startPrompt();
                }
            )
        });
    });
}

function updateEmployee() {
    connection.query("SELECT * from employee", function (err, res) {
        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Select an employee ID for whose role you would like to update",
                choices: selectEmployee()
            },
            {
                name: "role",
                type: "list",
                message: "What should their new role be?",
                choices: selectRole()
            }
        ]).then(function (res) {
            connection.query('UPDATE employee SET ? WHERE id = :UserID',
                {
                    UserID: res.employee,
                    role_id: res.role
                },
                function (err) {
                    if (err) throw err
                    console.table(res);
                    startPrompt();
                }
            )
        });
    });
}