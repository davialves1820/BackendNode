import UserController from "../../src/app/controllers/UserController.js";
import User from "../../src/app/models/User.js";

jest.mock("../../src/app/models/User");

describe("UserController Unit", () => {
    it("deve retornar erro se o usuário não existir", async () => {
        User.findByPk.mockResolvedValue(null);

        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await UserController.show(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });
});
