import database from "../src/database/index.js";
import User from "../src/app/models/User.js";

const WAIT = ms => new Promise(r => setTimeout(r, ms));

async function waitForDatabase() {
    let attempts = 10;

    while (attempts > 0) {
        try {
            await database.connection.authenticate();
            console.log("📌 Banco disponível para testes");
            return;
        } catch {
            console.log("⏳ Aguardando banco subir...");
            attempts--;
            await WAIT(1000);
        }
    }

    throw new Error("❌ Banco de testes não respondeu a tempo");
}

export default async () => {
    await waitForDatabase();
    await database.connection.sync({ force: true });

    await User.create({
        name: "Davi",
        email: "davi@gmail.com",
        password: "12345678",
        role: "ADMIN",
    });
};
