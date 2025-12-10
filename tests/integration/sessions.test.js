import request from "supertest";
import app from "../../src/app";
import User from "../../src/app/models/User";

describe("Sessions", () => {
    it("deve autenticar um usuário", async () => {

        // cria usuário no banco de testes
        await User.create({
            name: "Davi",
            email: "davialvesr18@gmail.com",
            password: "12345678"
        });

        const response = await request(app)
        .post("/sessions")
        .send({
            email: "davialvesr18@gmail.com",
            password: "12345678",
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

});
