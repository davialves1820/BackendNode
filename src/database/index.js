import { Sequelize } from "sequelize";
import config from "../config/database.js";

import User from "../app/models/User.js";
import Customer from "../app/models/customer.js";
import Contact from "../app/models/Contact.js";

const models = [User, Customer, Contact];

class Database {
    constructor() {
        this.connection = new Sequelize(config);
        this.init();
    }

    init() {
        // Inicializa todos os models
        models.forEach(model => model.init(this.connection));

        // Executa associate se existir
        models.forEach(model => {
            if (model.associate) {
                model.associate(this.connection.models);
            }
        });
    }
}

export default new Database();
