import { createNotificacion } from "../componentes/notificacion.js";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTRASEÑA_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,24}$/;

//Selectores
const emailInput = document.querySelector("#email");
const contraseñaInput = document.querySelector("#password");
const Boton = document.querySelector("#boton");
const form = document.querySelector("#form");

// Funcion Principal
const changeValidation = (event, valid, inputElement) => {
  const information = event.target.parentElement.querySelector("p");
  const shouldDisable = !emailValid || !contraseñaValid;
  Boton.disabled = shouldDisable;
  console.log("Boton disabled:", shouldDisable, "emailValid:", emailValid, "contraseñaValid:", contraseñaValid);

  if (information) {
    if (valid) {
      inputElement.classList.remove("false");
      inputElement.classList.add("true");
      information.classList.remove("show-information");
    } else {
      inputElement.classList.remove("true");
      inputElement.classList.add("false");
      information.classList.add("show-information");
    }
  }
};

//validaciones
let emailValid = false;
let contraseñaValid = false;

emailInput.addEventListener("input", (event) => {
  console.log("Email:", event.target.value);
  emailValid = EMAIL_REGEX.test(event.target.value);
  console.log("Email valid:", emailValid);
  changeValidation(event, emailValid, emailInput);
});

contraseñaInput.addEventListener("input", (event) => {
  console.log("Password:", event.target.value);
  contraseñaValid = CONTRASEÑA_REGEX.test(event.target.value);
  console.log("Password valid:", contraseñaValid);
  changeValidation(event, contraseñaValid, contraseñaInput);
});

// form.addEventListener("submit", (event) => {
//   event.preventDefault();
//   const user = {
//     Contraseña: contraseñaInput.value,
//     Email: emailInput.value,
//   };
//   console.log(user);
//   alert("Se ha iniciado su sesión correctamente!");
//   window.location.pathname = "/todos";
// });

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const user = {
      email: emailInput.value,
      password: contraseñaInput.value,
    };

    // Petición al backend para autenticar y recibir la cookie de sesión
    await axios.post("/api/users/login", user, { withCredentials: true });

    alert("Se ha iniciado la sesión correctamente");
    window.location.pathname = "/todos";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Usuario o contraseña incorrectos");
  }
});
