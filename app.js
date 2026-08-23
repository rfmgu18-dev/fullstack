require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const usersRouter = require("./controllers/users");
const { PAGE_URL, MONGO_URI } = require("./config.js");
const todosRouter = require("./controllers/todos.js");
const { userExtractor } = require("./middleware/auth.js");

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

// 1. MIDDLEWARES GLOBAL
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny")); // Se coloca arriba para registrar todas las peticiones

// 2. RUTAS BACKEND (API)
app.use("/api/users", usersRouter);
app.use("/api/todos", userExtractor, todosRouter);

// 3. RUTAS FRONTEND Y ARCHIVOS ESTÁTICOS
app.use("/", express.static(path.join(__dirname, "PaginaPrincipal")));
app.use(
  "/registro",
  express.static(path.join(__dirname, "PaginaPrincipal", "registro")),
);
app.use("/imagenes", express.static(path.join(__dirname, "img")));
app.use("/todos", express.static(path.resolve("views", "todos")));
app.use('/login', express.static(path.join(__dirname, 'login')));

// Estáticos y vista para la verificación de correo
app.use(
  "/verify",
  express.static(path.join(__dirname, "PaginaPrincipal", "verify")),
);
app.get("/verify/:id/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "PaginaPrincipal", "verify", "index.html"));
});

console.log("PAGE_URL:", PAGE_URL);

module.exports = app;
