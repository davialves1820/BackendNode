import CustomersService from "../services/CustomersService.js";
import { buildFilters } from "../utils/buildFilters.js";
import { getPagination, getOrder } from "../utils/pagination.js";

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Gestão de clientes
 */


class CustomersController {

    /**
     * @swagger
     * /customers:
     *   get:
     *     summary: Lista clientes com filtros e paginação
     *     tags: [Customers]
     *     parameters:
     *       - in: query
     *         name: name
     *       - in: query
     *         name: email
     *     responses:
     *       200:
     *         description: Lista de clientes
     */

    async index(req, res) {
        const where = buildFilters(req.query, ["name", "email"]);

        const { limit, offset } = getPagination(req.query);
        const order = getOrder(req.query.sort, ["name", "email", "createdAt"]);

        const data = await CustomersService.list({ where, order, limit, offset });
        return res.status(200).json(data);
    }

    /**
     * @swagger
     * /customers/{id}:
     *   get:
     *     summary: Retorna um cliente pelo ID
     *     tags: [Customers]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *     responses:
     *       200:
     *         description: Cliente encontrado
     *       404:
     *         description: Cliente não encontrado
     */

    async show(req, res) {
        const customer = await CustomersService.get(
            req.params.id
        );
        return res.json(customer);
    }

    /**
     * @swagger
     * /customers:
     *   post:
     *     summary: Cria um novo cliente
     *     tags: [Customers]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [name, email]
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               status:
     *                  Enum[ACTIVE, INACTIVE]
     *     responses:
     *       201:
     *         description: Cliente criado
     */

    async create(req, res) {
        const customer = await CustomersService.create(
            req.body
        );
        return res.status(201).json(customer);
    }

    /**
     * @swagger
     * /customers/{id}:
     *   put:
     *     summary: Atualiza um cliente pelo ID
     *     tags: [Customers]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [name, email]
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               status:
     *                  Enum[ACTIVE, INACTIVE]
     *     responses:
     *       200:
     *         description: Cliente atualizado
     */

    async update(req, res) {
        const { id } = req.params;

        const customer = await CustomersService.update({
            id,
            data: req.body,
        });

        return res.json(customer);
    }

    /**
     * @swagger
     * /customers/{id}:
     *   delete:
     *     summary: Exclui um cliente pelo ID
     *     tags: [Customers]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *     responses:
     *       204:
     *         description: Cliente excluído
     */

    async delete(req, res) {
        await CustomersService.remove(req.params.id);
        return res.status(204).send();
    }
}

export default new CustomersController();
