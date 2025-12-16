import UsersService from "../services/UserService.js";
import { buildFilters } from "../utils/buildFilters.js";
import { getPagination, getOrder } from "../utils/pagination.js";

class UsersController {
    async index(req, res) {
        const where = buildFilters(req.query, ["name", "email"]);

        const { limit, offset } = getPagination(req.query);
        const order = getOrder(req.query.sort, ["name", "email", "createdAt"]);

        const data = await UsersService.list({ where, order, limit, offset });
        return res.json(data);
    }

    async show(req, res) {
        const user = await UsersService.get(
            req.params.id
        );
        return res.json(user);
    }

    async create(req, res) {
        console.log("DummyJob");
        const user = await UsersService.create(
            req.body
        );

        return res.status(201).json(user);
    }

    async update(req, res) {
        const { id } = req.params;

        const user = await UsersService.update({
            id,
            data: req.body,
        });

        return res.json(user);
    }

    async delete(req, res) {
        await UsersService.remove(req.params.id);
        return res.status(204).send();
    }
}

export default new UsersController();
