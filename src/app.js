import express from 'express'
import routes from './routes'
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
require('dotenv').config();

//import authMiddleware from './app/middlewares/auth'
import './database' // Garante que a conexão com o banco de dados seja estabelecida

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json()); // Habilita o parsing de JSON no corpo das requisições
        this.server.use(express.urlencoded({ extended: false })); // Habilita o parsing de dados codificados em URL
        
        // Swagger Docs
        this.server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        //this.server.use(authMiddleware); // Aplica o middleware de autenticação globalmente
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;