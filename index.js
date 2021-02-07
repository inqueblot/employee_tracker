const inquirer = require('inquirer');
const connection = require('./db_connection')
const ConsoleTab = require('console.table');
const roleArr = []
const managerArr = []
const departmentArr = []



//populates the roleArr
const popRole = function () {
    connection.query('SELECT id FROM role', function (err, res) {
        if (err) throw err;
        res.forEach(element => {
            roleArr.push(element.id)
        });
    });
};
//populates the departmentArr
const popDepartment = function () {
    connection.query('SELECT id FROM department', function (err, res) {
        if (err) throw err;
        res.forEach(element => {
            departmentArr.push(element.id)
        });
    });
};
//populates the managerArr
const popManager = function () {
    connection.query('SELECT id FROM employee WHERE role_id = 1', function (err, res) {
        if (err) throw err;
        res.forEach(element => {
            managerArr.push(element.id)
        });
    });
};

const tableDisplay = function () {
    connection.query('SELECT first_name, last_name, title, salary, name FROM  employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY last_name',
        function (err, res) {
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
            choices: ['Add', 'View', 'Update', 'Quit']
        }
    ]).then((answers) => {
        console.log(answers.action);
        switch (answers.action) {
            case 'Add':
                addQuestions();
                break;
            case 'View':
                //addRole();
                break;
            case 'Update':
                //addDepartment();
                break;
            case 'Quit':
                connection.end();
        }
    });
};

const addQuestions = function () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['Add Employee', 'Add Role', 'Add Department', 'Quit']
        }
    ]).then((answers) => {
        console.log(answers.action);
        switch (answers.action) {
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Quit':
                connection.end();
        }
    });
};

const addEmployee = function () {
    connection.query('SELECT id, title FROM role', function (err, res) {
        if (err) throw err;
        console.table(res);
        managerTab();
    });

    const managerTab = function () {
        connection.query('SELECT id, first_name, last_name FROM employee WHERE role_id = 1', function (err, res) {
            if (err) throw err;
            console.table(res)
            empQuestions();
        })
    };

    const empQuestions = function () {
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
};

const addRole = function () {
    //populates department choices
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        console.table(res);
        roleQuestions();
    });
    //generates new role
    const roleQuestions = function () {
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

                connection.query("INSERT INTO role SET ?", answers, function (err, res) {
                    if (err) throw err;
                });
                popRole();
                tableDisplay();
            });
    };
}

const addDepartment = function () {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: "What is the name of the department?",
                validate: function (value) {
                    if (!value)
                        return "please enter a name"
                    return true
                }
            },
        ]).then((answers) => {

            connection.query("INSERT INTO department SET ?", answers, function (err, res) {
                if (err) throw err;
            });
            popDepartment();
            tableDisplay();
        });
};

//initial population
console.log('EMPLOYEE DATABASE')
popDepartment();
popManager();
popRole();
tableDisplay();