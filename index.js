const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001

const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "solfadb",
    password: "1234"
});

//тестирование подключения к бд
connection.connect(function (err) {
    if (err) {
        console.log("Ошибка: " + err.message);
    } else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});
//
// connection.query("SELECT password FROM users WHERE login = 'mary'",function(err, result){
//     if(err){
//         console.log("Ошибка: " + err.message);
//     }else{
//         console.log(result);
//     }
// });

//закрытие подключения
// connection.end(function(err){
//    if(err){
//        console.log("Ошибка: " + err.message);
//    }else{
//        console.log("Подключение закрыто");
//    }
// });


app.use(
    cors({
        credentials: true,
        origin: true
    })
);

app.get('/auth/', function (req, res) {
    const info = req.query.q.split(",");
    connection.query("SELECT * FROM users WHERE login = ? AND password = ?", [info[0].toString(), info[1].toString()], function (err, result) {
        if (err) {
            console.log(err);
            res.json("Что-то пошло не так. Попробуйте еще раз.")
        } else {
            if(result[0] !== undefined){
                if(result[0].login === "ADMIN"){
                    res.json("It's admin");
                } else {
                    res.json("It's user");
                }
            }
            else{
                res.json("Такого пользователя не существует.");
            }
        }
    });
})
// app.get('/reg/', function (req, res) {
//     const info = req.query.q.split(",");
//     connection.query("SELECT * FROM users WHERE login = ?", [info[0]], function (err, result) {
//         if (err) {
//             console.log(err);
//         } else {
//             if (result[0] === undefined) {
//                 console.log("Пользователь не существует");
//                 connection.query("INSERT INTO users (login, email, password) VALUES (?, ?, ?)", [info[0], info[1], info[2]], function (err, result) {
//                     if(err){
//                         console.log(err);
//                     }else{
//                         res.json("Пользователь был успешно создан");
//                     }
//                 });
//             } else {
//                 console.log("Пользователь уже существует");
//                 res.json("Пользователь уже существует");
//             }
//         }
//     });
// })

app.get('/reg/', function (req, res) {
    const info = req.query.q.split(",");
    connection.query("INSERT INTO users (login, email, password) VALUES (?, ?, ?)", [info[0], info[1], info[2]], function (err, result)  {
        if (err) {
            console.log(err);
            if(err.toString().includes("Duplicate entry")){
                res.json("Такой логин уже используется");
            }
        } else {
            res.json("Пользователь был успешно создан");
        }
    });
})

app.listen(port, '0.0.0.0', () => console.log(`Server is live at http://localhost:${port}`));