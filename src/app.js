import express from 'express'
import routes from './routes'

import './database' // Garante que a conexão com o banco de dados seja estabelecida

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json()); // Habilita o parsing de JSON no corpo das requisições
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;