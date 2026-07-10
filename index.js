const app = require('./app.js');
const http = require('http');

const server = http.createServer(app);

server.listen(3003, () =>{
    console.log('El servidor esta ejecutandose en el puerto 3000');
   
})