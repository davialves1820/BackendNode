import express from 'express'
import routes from './routes'

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