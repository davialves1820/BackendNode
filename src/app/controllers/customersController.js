import CustomersService from "../services/CustomersService.js";
import { buildFilters } from "../utils/buildFilters.js";
import { getPagination, getOrder } from "../utils/pagination.js";

class CustomersController {
    async index(req, res) {
        const where = buildFilters(req.query, ["name", "email"]);

        const { limit, offset } = getPagination(req.query);
        const order = getOrder(req.query.sort, ["name", "email", "createdAt"]);

        const data = await CustomersService.list({ where, order, limit, offset });
        return res.json(data);
    }

    async show(req, res) {
        const customer = await CustomersService.get(
            req.params.id
        );
        return res.json(customer);
    }

    async create(req, res) {
        const customer = await CustomersService.create(
            req.body
        );
        return res.status(201).json(customer);
    }

    async update(req, res) {
        const { id } = req.params;

        const customer = await CustomersService.update({
            id,
            data: req.body,
        });

        return res.json(customer);
    }

    async delete(req, res) {
        await CustomersService.remove(req.params.id);
        return res.status(204).send();
    }
}

export default new CustomersController();
