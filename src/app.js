import express from "express";
import routes from "./routes/routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import dotenv from "dotenv";

import "./database/index.js";
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

        // Logger custom (requestId + contexto)
        this.server.use(loggerMiddleware);

        // Morgan + Winston
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
