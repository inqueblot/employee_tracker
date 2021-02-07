const inquirer = require('inquirer');
const connection = require('./db_connection')
const ConsoleTab = require('console.table');
const roleArr = [1, 2]
const managerArr = [1]
const departmentArr = [1, 2, 3, 4]


console.log('EMPLOYEE DATABASE')


const tableDisplay = function () {
    connection.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res);
        initQuestions();
    });


};

const initQuestions = function () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Add Role', 'Update Employee Role', 'Quit']
        }
    ]).then((answers) => {
        console.log(answers.action);
        switch (answers.action) {
            case 'View All Employees':
                console.log('some employees')
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Update Employee Role':
                console.log('update on');
                break;
            case 'Quit':
                connection.end();
        }
    });
};

const addEmployee = function () {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "What is the employee's first name?",
                validate: function (value) {
                    if (!value)
                        return "please enter a name"
                    return true
                }

            },
            {
                type: 'input',
                name: 'last_name',
                message: "What is the employee's last name?",
                validate: function (value) {
                    if (!value)
                        return "please enter a name"
                    return true
                }
            },
            {
                type: 'list',
                name: 'role_id',
                message: "What is the employee's job title?",
                choices: roleArr,
            },
            {
                type: 'list',
                name: 'manager_id',
                message: "Who is the employee's direct report?",
                choices: managerArr,
            }
        ]).then((answers) => {
            console.log(answers)
            connection.query("INSERT INTO employee SET ?", answers, function (err, res) {
                if (err) throw err;
                // console.table(results)
            });
            tableDisplay();
        });
};

const addRole = function () {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: "What is title of the role?",
                validate: function (value) {
                    if (!value)
                        return "please enter a name"
                    return true
                }

            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the yearly salary for this role?",
                validate: function (value) {
                    var pass = parseInt(value);
                    if (!Number.isInteger(pass))
                        return "please enter a number"
                    return true
                }
            },
            {
                type: 'list',
                name: 'department_id',
                message: "What department does this role belong to?",
                choices: departmentArr,
            },
        ]).then((answers) => {
            console.log(answers)
            connection.query("INSERT INTO role SET ?", answers, function (err, res) {
                if (err) throw err;
            });
            tableDisplay();
        });
};

tableDisplay();