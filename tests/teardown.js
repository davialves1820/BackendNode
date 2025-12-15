import database from "../src/database/index.js";

export default async () => {
    await database.connection.close();
};
