import { createNotificacion } from "../componentes/notificacion.js";
const formulario = document.querySelector('#formulario');
const nameInput = document.querySelector('#nombre');
const emailInput = document.querySelector('#email');
const contrasenaInput = document.querySelector('#contrasena');
const confirmarContrasena = document.querySelector('#confirmarContrasena');
const btnFormulario = document.querySelector('#btn-formulario');
const notificacion = document.querySelector('#notificacion');

//Regex validaciones
const EMAIL_VALIDATION = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const NAME_VALIDATION = /^[A-Z\u00f1][a-zA-Z-ÿ\u00f1\u00d1]+(\s*[A-Z\u00f1][a-zA-Z-ÿ\u00f1\u00d1\s]*)$/;

//Validaciones
let nameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let confirPasswordValidation = false;

const validation = (input, regexValidation) => {
    if(input.value === ''){
        input.classList.remove('outline-red-700', 'outline-2', 'outline');
        input.classList.remove('outline-green-700');
        input.classList.add('focus:outline-indigo-700');
    } else if(regexValidation){
        input.classList.remove('focus:outline-indigo-700');
        input.classList.remove('outline-red-700', 'outline-2', 'outline');
        input.classList.add('outline-green-700', 'outline-2', 'outline');
    } else if (!regexValidation){
        input.classList.remove('focus:outline-indigo-700');
        input.classList.remove('outline-green-700');
        input.classList.add('outline-red-700', 'outline-2', 'outline');
    }

    btnFormulario.disabled = !(nameValidation && emailValidation && passwordValidation && confirPasswordValidation);
}

//Eventos
nameInput.addEventListener('input', evento =>{
    nameValidation = NAME_VALIDATION.test(evento.target.value);
    validation(nameInput, nameValidation);
});

emailInput.addEventListener('input', evento =>{
    emailValidation = EMAIL_VALIDATION.test(evento.target.value);
    validation(emailInput, emailValidation);
});

contrasenaInput.addEventListener('input', evento =>{
    passwordValidation = PASSWORD_VALIDATION.test(evento.target.value);
    confirPasswordValidation = evento.target.value === confirmarContrasena.value;
    validation(contrasenaInput, passwordValidation);
    validation(confirmarContrasena, confirPasswordValidation);
});

confirmarContrasena.addEventListener('input', evento =>{
    confirPasswordValidation = evento.target.value === contrasenaInput.value;
    validation(confirmarContrasena, confirPasswordValidation);
});

formulario.addEventListener('submit', async evento =>{
    evento.preventDefault();

    try {
        const newUser = {
            name: nameInput.value,
            email: emailInput.value,
            password: contrasenaInput.value,
        };
        
        const {data} = await axios.post('/api/users', newUser);
        createNotificacion(false, data)
        setTimeout(() => {
            notificacion.classList.add('hidden');
        }, 5000);

        nameInput.value ='';
        emailInput.value ='';
        contrasenaInput.value ='';
        confirmarContrasena.value = '';
        nameValidation = false;
        emailValidation = false;
        passwordValidation = false;
        confirPasswordValidation = false;

        validation(nameInput, false);
        validation(emailInput, false);
        validation(contrasenaInput, false);
        validation(confirmarContrasena, false);
    } catch (error) {
        createNotificacion(true, error.response.data.error)
        setTimeout(() => {
            notificacion.classList.add('hidden');
        }, 5000);
        
    }
});
