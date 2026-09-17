const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");
const { PAGE_URL } = require("../config");
const { json } = require("express");

usersRouter.post("/", async (request, response) => {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response
      .status(400)
      .json({ error: "Todos los espacios son requeridos" });
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return response
      .status(400)
      .json({ error: "El Email ya se encuentra en uso" });
  }

  try {
    const apiKey = process.env.ABSTRACT_API_KEY;
    const url = `https://emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

    const abstractResponse = await axios.get(url);

    const status = abstractResponse.data?.email_deliverability?.status;

    if (status === "undeliverable") {
      return response
        .status(400)
        .json({
          error:
            "El correo electrónico proporcionado no existe o no es válido.",
        });
    }
  } catch (apiError) {
    console.error("Error al conectar con Abstract API:", apiError.message);
  }

  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name,
    email,
    passwordHash,
    verified: true,
  });

  await newUser.save();

  return response.status(201).json("Usuario creado, verifica tu correo");
});

usersRouter.post("/login", async (request, response) => {
  const { email, password } = request.body;
  console.log("Intento de login con email:", email);

  // 1. Buscar si el usuario existe
  const user = await User.findOne({ email });
  console.log("Usuario encontrado:", user ? "SI" : "NO");
  if (!user) {
    return response
      .status(400)
      .json({ error: "Usuario o contraseña incorrectos" });
  }

  // 2. Verificar la contraseña
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  console.log("Contraseña correcta:", passwordCorrect);
  if (!passwordCorrect) {
    return response
      .status(400)
      .json({ error: "Usuario o contraseña incorrectos" });
  }

  // 3. Crear el token de sesión
  const userForToken = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  // 4. Enviar la cookie al navegador
  response.cookie("accessToken", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return response
    .status(200)
    .json({ message: "Sesión iniciada correctamente" });
});

module.exports = usersRouter;
