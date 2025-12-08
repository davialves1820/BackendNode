import Sequelize, { Model } from "sequelize";

class File extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            path: Sequelize.STRING,
        },
        {
            sequelize,
            name: {
                singular: "file",
                plural: "files",
            }
        });
        return this;
    }

    static associate(models) {
        this.hasMany(models.User);
    }
}

export default File;