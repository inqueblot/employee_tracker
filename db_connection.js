const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'employee_db'
});




const connect = function () {


    // connection.connect((err) => {
    //     if (err) throw err;
    //     console.log('connected as id ' + connection.threadId);
    // });

    // connection.query("SELECT title, salary FROM role", function (error, results) {
    //     if (error) throw error;
    //     console.table(results)
    // });
    // connection.end();
};

module.exports = connection

// Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
// findAllEmployees() {
//     return this.connection.query(
//         "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
//     );
// }