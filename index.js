const inquirer = require('inquirer');
const connect = require('./db_connection')

console.log('EMPLOYEE DATABASE')

// connect();


inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role']
    }
])