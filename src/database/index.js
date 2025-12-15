import { Sequelize } from "sequelize";
import config from "../config/database.js";

class Database {
    constructor() {
        const env = process.env.NODE_ENV || "development";
        this.connection = new Sequelize(config[env]);
    }

    init(models) {
        models.forEach(model => model.init(this.connection));

        models.forEach(model => {
            if (model.associate) {
                model.associate(this.connection.models);
            }
        });
    }
}

export default new Database();
