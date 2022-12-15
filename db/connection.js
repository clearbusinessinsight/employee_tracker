const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3301,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "employees"
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  init();
});



module.exports = connection;
