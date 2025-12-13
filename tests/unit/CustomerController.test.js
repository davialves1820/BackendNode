import CustomerController from "../../src/app/controllers/CustomersController";
import Customer from "../../src/app/models/Customer";

jest.mock("../../src/app/models/Customer");

describe("CustomerController Unit", () => {
    it("index deve retornar lista de clientes", async () => {
        Customer.findAll.mockResolvedValue([{ id: 1, name: "Teste" }]);

        const req = { query: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await CustomerController.index(req, res);
        console.log(res.body);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 1, name: "Teste" }]);
    });
});
