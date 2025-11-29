let customers = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
        ]; // Array to store customers

class customersController {

    // List all customers
    index(req, res) {
        return res.json(customers);
    }

    // Show a specific customer by ID
    show(req, res) {
        const id = parseInt(req.params.id)  // Extrai id e name do corpo da requisição
        const customer = customers.find(item => item.id === id); // Verifica se o cliente já existe
        const status = customer ? 200 : 400; // Define o status com base na existência do cliente

        return res.status(status).json(customer); // Retorna o cliente criado com status 201
    }

    // Create a new customer
    create(req, res) {
        const { name } = req.body; // Extrai id e name do corpo da requisição
        const id = customers[customers.length - 1].id + 1; // Gera o próximo id

        const new_customer = { id, name }; // Cria um novo cliente
        this.customers.push(new_customer); // Adiciona o novo cliente ao array
        
        return res.status(201).json(new_customer); // Retorna o cliente criado com status 201
    }

    // Update an existing customer by ID
    update(req, res) {
        const id = parseInt(req.params.id); // Extrai o id dos parâmetros da rota
        const { name } = req.body; // Extrai o nome do corpo da requisição
        
        // Encontra o índice do cliente a ser atualizado
        const index = customers.findIndex(item => item.id === id);
        const status = index >= 0 ? 200 : 400; // Define o status com base na existência do cliente

        if (index >= 0) {
            customers[index].name = name; // Atualiza o nome do cliente
        }

        return res.status(status).json(customers[index]); // Retorna o cliente atualizado
    }  

    // Delete a customer by ID
    delete(req, res) {
        const id = parseInt(req.params.id); // Extrai o id dos parâmetros da rota
        const index = customers.findIndex(item => item.id === id); // Encontra o índice do cliente a ser deletado
        const status = index >= 0 ? 200 : 400; // Define o status com base na existência do cliente

        if (index >= 0) {
            customers.splice(index, 1); // Remove o cliente do array
        }

        return res.status(status).json(); // Retorna uma resposta vazia
    }
}

export default new customersController();