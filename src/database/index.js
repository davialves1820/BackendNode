import { Sequelize } from "sequelize";
import config from "../config/database.js";

import User from "../app/models/user.js";
import Customer from "../app/models/customer.js";
import Contact from "../app/models/contact.js";
import File from "../app/models/File.js";

const models = [User, Customer, Contact, File];

class Database {
    constructor() {
        const env = process.env.NODE_ENV || "development";
        const configEnv = config[env];

        this.connection = new Sequelize(configEnv);
        this.init();
        this.associate();
    }

    init() {
        // Inicializa todos os models
        models.forEach(model => model.init(this.connection));
    }

    associate() {
        // Executa associate se existir
        models.forEach(model => {
            if (model.associate) {
                model.associate(this.connection.models);
            }
        });
    }
}

export default new Database();
