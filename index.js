const express = require('express');
const server = express();

// Define uma rota GET para a raiz do servidor
server.get('/', (req, res) => {
    res.send('Hello World!');
});

server.listen(3000); // Inicia um serviço na porta 3000
console.log('Servidor rodando na porta 3000');