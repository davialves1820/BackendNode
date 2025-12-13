import express from 'express'
import routes from './routes.js'
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import Youch from "youch";
import dotenv from "dotenv";
dotenv.config();


//import authMiddleware from './app/middlewares/auth'
import './database/index.js' // Garante que a conexão com o banco de dados seja estabelecida
import errorHandler from './app/middlewares/errorHandler.js';

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
        this.exceptionHandler();
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

    exceptionHandler() {
        this.server.use(errorHandler);
        /*this.server.use(async (err, req, res, next) => {
            if (process.env.NODE_ENV === "development") {
                const errors = await new Youch(err, req).toJSON();
                return res.status(500).json(errors);
            }
            return res.status(500).json({ error: "Internal server error" });
        });*/
    }
}

export default new App().server;