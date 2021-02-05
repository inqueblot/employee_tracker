const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'employee_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
});

connection.query("SELECT * FROM employee WHERE id=1", function (error, results) {
    if (error) throw error;
    console.log('the solution is: ', results)
});
connection.end();