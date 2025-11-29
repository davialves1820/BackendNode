const express = require('express');
const server = express();

server.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

let customers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
]; // Array para armazenar os clientes

server.get('/customers', (req, res) => {
    return res.json(customers); // Retorna a lista de clientes
});

server.get('/customers/:id', (req, res) => {
    const id = parseInt(req.params.id)  // Extrai id e name do corpo da requisição
    const customer = customers.find(item => item.id === id); // Verifica se o cliente já existe
    const status = customer ? 200 : 400; // Define o status com base na existência do cliente

    return res.status(status).json(customer); // Retorna o cliente criado com status 201
});

server.post('/customers', (req, res) => {
    const { name } = req.body; // Extrai id e name do corpo da requisição
    const id = customers[customers.length - 1].id + 1; // Gera o próximo id

    const new_customer = { id, name }; // Cria um novo cliente
    customers.push(new_customer); // Adiciona o novo cliente ao array
    
    return res.status(201).json(new_customer); // Retorna o cliente criado com status 201
});

server.put('/customers/:id', (req, res) => {
    const id = parseInt(req.params.id); // Extrai o id dos parâmetros da rota
    const { name } = req.body; // Extrai o nome do corpo da requisição
    
    // Encontra o índice do cliente a ser atualizado
    const index = customers.findIndex(item => item.id === id);
    const status = index >= 0 ? 200 : 400; // Define o status com base na existência do cliente

    if (index >= 0) {
        customers[index].name = name; // Atualiza o nome do cliente
    }

    return res.status(status).json(customers[index]); // Retorna o cliente atualizado
});

server.delete('/customers/:id', (req, res) => {
    const id = parseInt(req.params.id); // Extrai o id dos parâmetros da rota
    const index = customers.findIndex(item => item.id === id); // Encontra o índice do cliente a ser deletado
    const status = index >= 0 ? 200 : 400; // Define o status com base na existência do cliente

    if (index >= 0) {
        customers.splice(index, 1); // Remove o cliente do array
    }

    return res.status(status).json(); // Retorna uma resposta vazia
});

server.listen(3000); // Inicia um serviço na porta 3000
console.log('Servidor rodando na porta 3000');