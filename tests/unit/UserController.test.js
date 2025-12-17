import UserController from "../../src/app/controllers/UserController.js";
import User from "../../src/app/models/user.js";
import AppError from "../../src/app/errors/AppError.js";

jest.mock("../../src/app/models/User.js");

describe("UserController Unit", () => {
    it("deve lançar erro se o usuário não existir", async () => {
        // Arrange
        User.findByPk.mockResolvedValue(null);

        const req = { params: { id: 1 } };
        const res = {};

        // Act + Assert
        try {
            await UserController.show(req, res);
            fail("Erro não foi lançado");
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe("User not found");
            expect(error.statusCode).toBe(404);
        }
    });
});
