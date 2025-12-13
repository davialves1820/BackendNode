import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/app/models/User.js";
import database from "../../src/database/index.js";

describe("Sessions", () => {
    beforeEach(async () => {
        await User.destroy({ where: {} });
    });

    afterAll(async () => {
        await database.connection.close();
    });

    it("deve autenticar um usuário", async () => {
        await User.create({
            name: "Davi",
            email: "davi@r18.com",
            password: "12345678",
            role: "ADMIN",
        });

        const response = await request(app)
            .post("/sessions")
            .send({
                email: "davi@r18.com",
                password: "12345678",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });
});
