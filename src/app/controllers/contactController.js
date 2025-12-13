import ContactService from "../services/ContactService.js";
import { buildFilters } from "../utils/buildFilters.js";
import { getPagination, getOrder } from "../utils/pagination.js";

class ContactController {
    async index(req, res) {
        const where = buildFilters(req.query, ["name", "email"]);
        where.customer_id = req.params.customerId;

        const { limit, offset } = getPagination(req.query);
        const order = getOrder(req.query.sort, ["name", "email", "createdAt"]);

        const data = await ContactService.list({ where, order, limit, offset });
        return res.json(data);
    }

    async show(req, res) {
        const contact = await ContactService.get(
            req.params.customerId,
            req.params.id
        );
        return res.json(contact);
    }

    async create(req, res) {
        const contact = await ContactService.create(
            req.params.customerId,
            req.body
        );
        return res.status(201).json(contact);
    }

    async update(req, res) {
        const { customerId, id } = req.params;

        const contact = await ContactService.update({
            customerId,
            id,
            data: req.body,
        });

        return res.json(contact);
    }

    async delete(req, res) {
        await ContactService.remove(req.params.customerId, req.params.id);
        return res.status(204).send();
    }
}

export default new ContactController();
