require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require("./controllers/users");
const { PAGE_URL } = require('./config.js');

const app = express();

// Conexión a Base de Datos
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_TEST);
        console.log("Conectado a MongoDB exitosamente");
    } catch (error) {
        console.log("Error de conexión:", error);
    }
})();

// Middleware para leer JSON
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// 1. RUTAS BACKEND
app.use('/api/users', usersRouter);

// 2. RUTAS FRONTEND / ESTÁTICOS
app.use('/', express.static(path.resolve('PaginaPrincipal')));
app.use('/registro', express.static(path.resolve('PaginaPrincipal', 'registro')));
app.use('/imagenes', express.static(path.resolve('img')));

app.use(morgan('tiny'));


console.log(PAGE_URL);
module.exports = app;
