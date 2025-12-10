import database from "../src/database";

module.exports = async () => {
    await database.connection.close();
    
};
