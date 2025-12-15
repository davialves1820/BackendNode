import database from "../src/database/index.js";

const WAIT = ms => new Promise(r => setTimeout(r, ms));

export default async () => {
    let attempts = 10;

    while (attempts > 0) {
        try {
            await database.connection.authenticate();
            console.log("📌 Banco disponível para testes");
            break;
        } catch {
            console.log("⏳ Aguardando banco subir...");
            attempts--;
            await WAIT(1000);
        }
    }

    if (attempts === 0) {
        throw new Error("❌ Banco não respondeu");
    }

    await database.connection.sync({ force: true });
};
