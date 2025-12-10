import request from "supertest";
import app from "../../src/app";
import User from "../../src/app/models/User";
import jwt from "jsonwebtoken";
import authConfig from "../../src/config/auth";

describe("Customers Integration", () => {

    let token;

    beforeAll(async () => {
        const user = await User.create({
            name: "Tester",
            email: "tester@example.com",
            password: "12345678"
        });

        token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
        });
    });

    it("deve listar clientes", async () => {
        const response = await request(app)
        .get("/customers")
        .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("deve criar um cliente", async () => {
        const response = await request(app)
        .post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Cliente Teste",
            email: "teste@cliente.com",
            status: "ACTIVE",
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
    });

});
