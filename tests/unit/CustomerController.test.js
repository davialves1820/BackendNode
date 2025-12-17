import CustomerController from "../../src/app/controllers/customersController.js";
import Customer from "../../src/app/models/customer.js";

jest.mock("../../src/app/models/Customer.js");

describe("CustomerController Unit", () => {
    it("index deve retornar lista de clientes", async () => {
        // Arrange
        Customer.findAll.mockResolvedValue([{ id: 1, name: "Teste" }]);

        const req = { query: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Act
        await CustomerController.index(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1, name: "Teste" }]);
    });
});
