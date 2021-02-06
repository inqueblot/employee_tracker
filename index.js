const inquirer = require('inquirer');
const connection = require('./db_connection')
const roleArr = [1, 2]
const managerArr = [1]
console.log('EMPLOYEE DATABASE')

console.log(connection)


inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role']
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
        case 'Update Employee Role':
            console.log('update on')
    }
});

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
            connection.end();
        })
};