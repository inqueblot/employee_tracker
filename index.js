const inquirer = require('inquirer');
const connection = require('./db_connection')
const ConsoleTab = require('console.table');
const roleArr = []
const managerArr = []
const departmentArr = []
const employeeArr = []



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

const popEmployee = function () {
    connection.query('SELECT id FROM employee', function (err, res) {
        if (err) throw err;
        res.forEach(element => {
            employeeArr.push(element.id)
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
                viewQuestions();
                break;
            case 'Update':
                updateQuestions();
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
            message: 'What would you like to add?',
            choices: ['Add Employee', 'Add Role', 'Add Department', 'Go Back', 'Quit']
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
            case 'Go Back':
                initQuestions();
                break;
            case 'Quit':
                connection.end();
        }
    });
};

const viewQuestions = function () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to view?',
            choices: ['Employee', 'Role', 'Department', 'Go Back', 'Quit']
        }
    ]).then((answers) => {
        console.log(answers.action);
        switch (answers.action) {
            case 'Employee':
                tableDisplay();
                break;
            case 'Role':
                viewRole();
                break;
            case 'Department':
                viewDepartment();
                break;
            case 'Go Back':
                initQuestions();
                break;
            case 'Quit':
                connection.end();
        }
    });
};

const updateQuestions = function () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to update?',
            choices: ["Employee's Role", "Employee's Manager", 'Go Back', 'Quit']
        }
    ]).then((answers) => {
        console.log(answers.action);
        switch (answers.action) {
            case "Employee's Role":
                changeRole();
                break;
            case "Employee's Manager":
                changeManager();
                break;
            case 'Go Back':
                initQuestions();
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

const viewDepartment = function () {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        console.table(res);
        initQuestions();
    });
};

const viewRole = function () {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        console.table(res);
        initQuestions();
    });
};

//viewEmployee is already defined as tableDisplay()

const changeRole = function () {
    connection.query('SELECT employee.id, first_name, last_name, title FROM  employee LEFT JOIN role ON employee.role_id = role.id ORDER BY last_name',
        function (err, res) {
            if (err) throw err;
            console.table(res);
            roleTable();
        });

    const roleTable = function () {
        connection.query('SELECT id, title FROM  role',
            function (err, res) {
                if (err) throw err;
                console.table(res);
                changeRoleQuestions();
            });
    };

    const changeRoleQuestions = function () {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'id',
                    message: 'Which employee are you updating?',
                    choices: employeeArr,
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'What will their new role be?',
                    choices: roleArr,
                }
            ]).then((answers) => {

                connection.query(`UPDATE employee SET role_id = ${answers.role_id} WHERE id = ${answers.id}`, function (err, res) {
                    if (err) throw err;
                });
                tableDisplay();
            });
    };
};

const changeManager = function () {
    connection.query('SELECT employee.id, first_name, last_name, title FROM  employee LEFT JOIN role ON employee.role_id = role.id ORDER BY last_name',
        function (err, res) {
            if (err) throw err;
            console.table(res);
            managerTab();
        });

    const managerTab = function () {
        connection.query('SELECT id, first_name, last_name FROM employee WHERE role_id = 1', function (err, res) {
            if (err) throw err;
            console.table(res)
            changeManagerQuestions();
        })
    };

    const changeManagerQuestions = function () {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'id',
                    message: 'Which employee are you updating?',
                    choices: employeeArr,
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Who will their new manager?',
                    choices: managerArr,
                }
            ]).then((answers) => {

                connection.query(`UPDATE employee SET manager_id = ${answers.manager_id} WHERE id = ${answers.id}`, function (err, res) {
                    if (err) throw err;
                });
                tableDisplay();
            });
    };
};

//initial population
console.log('EMPLOYEE DATABASE')
popDepartment();
popManager();
popRole();
popEmployee();
tableDisplay();