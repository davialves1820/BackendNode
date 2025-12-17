import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/app/models/user.js";
import jwt from "jsonwebtoken";
import { ROLES } from "../../src/app/constants/roles.js";

describe("Customers Integration", () => {
    let token;

    beforeAll(async () => {
        const user = await User.create({
            name: "Tester",
            email: "tester@example.com",
            password: "12345678",
            role: ROLES.ADMIN,
        });

        // 🔑 TOKEN AGORA TEM ROLE
        token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.SECRET,
            {
                expiresIn: process.env.EXPIRESIN,
            }
        );
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
                email: "cliente@teste.com",
                status: "ACTIVE",
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });
});
