import { createNotificacion } from "../componentes/notificacion.js";
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const CONTRASEÑA_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,24}$/;

//Selectores
const emailInput = document.querySelector("#email");
const contraseñaInput = document.querySelector("#password");
const Boton = document.querySelector("#boton");
const form = document.querySelector("#form");

// Funcion Principal
const changeValidation = (event, valid, inputElement) => {
    const information = event.target.parentElement.querySelector("p");
    Boton.disabled = !emailValid || !contraseñaValid ? true : false;
    console.log("information", information);

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
}

//validaciones
let emailValid = false;
let contraseñaValid = false;

emailInput.addEventListener("input", event => {
console.log(event.target.value);
emailValid = EMAIL_REGEX.test(event.target.value);
changeValidation(event, emailValid, emailInput)
    
});

contraseñaInput.addEventListener("input", event => {
    console.log(event.target.value);
    contraseñaValid = CONTRASEÑA_REGEX.test(event.target.value);
    changeValidation(event, contraseñaValid, contraseñaInput);

});

form.addEventListener("submit", event =>{
    event.preventDefault();
    const user = {
        Contraseña: contraseñaInput.value,
        Email: emailInput.value,
    }
    console.log(user)
    alert("Se ha iniciado su sesión correctamente!")
})