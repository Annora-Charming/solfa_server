const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(
    cors({
        credentials: true,
        origin: true
    })
);

app.get('/auth/', function (req, res) {
    const info = req.query.q.split(",");
    db.query("SELECT * FROM users WHERE login = ? OR email = ?", [info[0].toString(),info[0].toString()], function (err, result) {
        if (err) {
            res.json("Что-то пошло не так. Попробуйте еще раз.");
        } else if(result.length <= 0) {
            res.json("Такого пользователя не существует!");
        }
        else {
            const searchResult = JSON.parse(JSON.stringify(result));
            searchResult.map(mapResult => {
               const checkedPassword = bcrypt.compareSync(info[1], mapResult.password);
               if(checkedPassword === true){
                   const token = jwt.sign({
                       login:mapResult.login,
                       is_admin:mapResult.is_admin
                   }, config.jwt,{expiresIn:"3h"});
                   res.json(`Bearer ${token}`);
               } else {
                   res.json("Неверный пароль");
               }
            });
        }
    });
})

app.get('/reg/', function (req, res) {
    const info = req.query.q.split(",");
    db.query("SELECT * FROM users WHERE email = ?", [info[1].toString()], function (err, result){
        if (err) {
            res.json(err);
        } else if(typeof result !== undefined && result.length > 0){
            const searchResult = JSON.parse(JSON.stringify(result));
            searchResult.map(result => {
                res.json("Такой email уже используется");
            })
        }
        else{
            const salt = bcrypt.genSaltSync(7);
            const hashPassword = bcrypt.hashSync(info[2], salt);
            db.query("INSERT INTO users (login, email, password, is_admin) VALUES (?, ?, ?, ?)", [info[0], info[1], hashPassword, info[3]], function(err, result){
                if(err){
                    res.json(err);
                } else{
                    res.json("Пользователь был успешно создан");
                }
            })
        }
    })
})

app.listen(port, '0.0.0.0', () => console.log(`Server is live at http://localhost:${port}`));