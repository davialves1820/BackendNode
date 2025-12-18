import ContactService from "../services/ContactService.js";
import { buildFilters } from "../utils/buildFilters.js";
import { getPagination, getOrder } from "../utils/pagination.js";

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contatos vinculados a clientes
 */


class ContactController {

    /**
     * @swagger
     * /customers/{customerId}/contacts:
     *   get:
     *     summary: Lista contatos de um cliente
     *     tags: [Contacts]
     *     parameters:
     *       - in: path
     *         name: customerId
     *         required: true
     *       - in: query
     *         name: name
     *       - in: query
     *         name: email
     *     responses:
     *       200:
     *         description: Lista de contatos
     */

    async index(req, res) {
        const where = buildFilters(req.query, ["name", "email"]);
        where.customer_id = req.params.customerId;

        const { limit, offset } = getPagination(req.query);
        const order = getOrder(req.query.sort, ["name", "email", "createdAt"]);

        const data = await ContactService.list({ where, order, limit, offset });
        return res.json(data);
    }

    /**
     * @swagger
     * /customers/{customerId}/contacts/{id}:
     *   get:
     *     summary: Retorna um contato pelo ID
     *     tags: [Contacts]
     *     parameters:
     *       - in: path
     *         name: customerId
     *         required: true
     *       - in: path
     *         name: id
     *         required: true
     *     responses:
     *       200:
     *         description: Contato encontrado
     *       404:
     *         description: Contato não encontrado
     */

    async show(req, res) {
        const contact = await ContactService.get(
            req.params.customerId,
            req.params.id
        );
        return res.json(contact);
    }

    /**
     * @swagger
     * /customers/{customerId}/contacts:
     *   post:
     *     summary: Cria um novo contato para um cliente
     *     tags: [Contacts]
     *     parameters:
     *       - in: path
     *         name: customerId
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
     *       201:
     *         description: Contato criado
     */

    async create(req, res) {
        const contact = await ContactService.create(
            req.params.customerId,
            req.body
        );
        return res.status(201).json(contact);
    }

    /**
     * @swagger
     * /customers/{customerId}/contacts/{id}:
     *   put:
     *     summary: Atualiza um contato pelo ID
     *     tags: [Contacts]
     *     parameters:
     *       - in: path
     *         name: customerId
     *         required: true
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
     *         description: Contato atualizado
     */

    async update(req, res) {
        const { customerId, id } = req.params;

        const contact = await ContactService.update({
            customerId,
            id,
            data: req.body,
        });

        return res.json(contact);
    }

    /**
     * @swagger
     * /customers/{customerId}/contacts/{id}:
     *   delete:
     *     summary: Exclui um contato pelo ID
     *     tags: [Contacts]
     *     parameters:
     *       - in: path
     *         name: customerId
     *         required: true
     *       - in: path
     *         name: id
     *         required: true
     *     responses:
     *       204:
     *         description: Contato excluído
     */

    async delete(req, res) {
        await ContactService.remove(req.params.customerId, req.params.id);
        return res.status(204).send();
    }
}

export default new ContactController();
