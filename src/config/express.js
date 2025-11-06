const express = require("express");
const morgan = require("morgan");
const app = express();
const session = require("express-session");

app.use(express.json());//interpreta JSON
app.use(express.urlencoded({extended: true}));//Suporte para dados de formulario
app.use(morgan("combined"));//loggin no HTTP
app.use(session({
    secret: process.env.SESSION_SECRET || "livraria_secret_key",
    rolling: true,
    cookie:{
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 2
    }
}));

module.exports = app;