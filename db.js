const mysql = require('mysql2');
const config = require('./config');

const connection = mysql.createConnection({
    host: config.HOST,
    user: config.DBUSER,
    database: config.DBNAME,
    password: config.DBPASSWORD
});

//тестирование подключения к бд
connection.connect(function (err) {
    if (err) {
        console.log("Ошибка: " + err.message);
    } else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

module.exports = connection;