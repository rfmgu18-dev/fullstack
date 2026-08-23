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

  // =======================================================
  // VERIFICACIÓN DE EMAIL CON ABSTRACT EMAIL REPUTATION API
  // =======================================================
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

  // const token = jwt.sign({ id: savedUser.id }, process.env.ACCESS_TOKEN_SECRET, {
  //   expiresIn: '1m'
  // });

  /* 
  // NODEMAILER DESACTIVADO TEMPORALMENTE
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: savedUser.email,
    subject: "Verificacion de usuario",
    html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar Correo</a>`,
  });
  */

  return response.status(201).json("Usuario creado, verifica tu correo");
});

usersRouter.post("/login", async (request, response) => {
  const { email, password } = request.body;

  // 1. Buscar si el usuario existe
  const user = await User.findOne({ email });
  if (!user) {
    return response
      .status(400)
      .json({ error: "Usuario o contraseña incorrectos" });
  }

  // 2. Verificar la contraseña
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
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

// usersRouter.patch('/:id/:token', async (request, response) => {
//   const { id, token } = request.params;

//   try {
//     // 1. Verificar el token
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     const decodedId = decodedToken.id;
//     await User.findByIdAndUpdate(decodedId, { verified: true });

//     // 2. Marcar al usuario como verificado en la base de datos
//     await User.findByIdAndUpdate(decodedId, { verified: true });

//     return response.status(200).json({ message: 'Usuario verificado exitosamente.' });

//   } catch (error) {
//     console.log('El token expiró o es inválido. Generando uno nuevo...');

//     // 4. Buscar al usuario
//     const user = await User.findById(id);

//     if (!user) {
//       return response.status(404).json({ error: 'Usuario no encontrado.' });
//     }

//     // 5. Firmar un nuevo token
//     const newToken = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, {
//       expiresIn: '1m'
//     });

//     /*
//     // NODEMAILER DESACTIVADO
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // 7. Enviar correo usando newToken
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: "Verificacion de usuario",
//       html: `<a href="${PAGE_URL}/verify/${id}/${newToken}">Verificar Correo</a>`,
//     });
//     */

//     return response.status(400).json({
//       error: 'El link ya expiró. Se ha enviado un nuevo link de verificación a su correo.'
//     });
//   }
// });

module.exports = usersRouter;
