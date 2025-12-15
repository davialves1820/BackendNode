import AppError from "../errors/AppError.js";
import CustomersRepository from "../repositories/CustomersRepository.js";

class CustomersService {
    async list(filters) {
        return CustomersRepository.findAll(filters);
    }

    async get(id) {
        const customer = await CustomersRepository.findByPk(id);

        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        return customer;
    }

    async create(data) {
        return CustomersRepository.create(data);
    }

    async update({ id, data }) {
        const customer = await CustomersRepository.findByPk(id);

        if (!customer) {
            throw new AppError("Customer not found", 404);
        }

        await customer.update(data);

        return customer;
    }

    async remove(id) {
        const customer = await this.get(id);
        await CustomersRepository.delete(customer);
    }
}

export default new CustomersService();
