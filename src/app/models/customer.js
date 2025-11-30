import Sequelize, { Model } from "sequelize";

class Customer extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            status: Sequelize.ENUM("active", "archived"),
        },
        {
            sequelize,
        });
    }

    static associate(models) {
        this.hasMany(models.Contact);
    }
}

export default Customer;