const app = require("./app.js");
const http = require("http");

const server = http.createServer(app);

server.listen(3000, () => {
    console.log("El server está funcionando de manera exitosamente exitosa en el puerto 3000");
    
})