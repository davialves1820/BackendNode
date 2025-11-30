import Sequelize, { Model } from "sequelize";

class Contract extends Model {
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
        this.belongsTo(models.Customer, { foreignKey: "customer_id", as: "customer" });
    }
}

export default Contract;