import express from "express";
import routes from "./routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import dotenv from "dotenv";

import database from "./database/index.js";

import User from "./app/models/User.js";
import Customer from "./app/models/Customer.js";
import Contact from "./app/models/Contact.js";
import File from "./app/models/File.js";

database.init([User, Customer, Contact, File]);

import errorHandler from "./app/middlewares/errorHandler.js";
import loggerMiddleware from "./app/middlewares/logger.js";
import morganMiddleware from "./config/morgan.js";

dotenv.config();

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));

        // 🔹 Logger custom (requestId + contexto)
        this.server.use(loggerMiddleware);

        // 🔹 Morgan + Winston
        this.server.use(morganMiddleware);

        // Swagger
        this.server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    routes() {
        this.server.use(routes);
    }

    exceptionHandler() {
        this.server.use(errorHandler);
    }
}

export default new App().server;
