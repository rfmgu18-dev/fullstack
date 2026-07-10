require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

( async() =>{

    try {
        const conection = await mongoose.connect(process.env.MONGO_URI_TEST);
        
        console.log("Conectado a MongoDB exitosamente");
        
        
    } catch (error) {
        console.log(error);
        
    }
} )();

module.exports = app.js;