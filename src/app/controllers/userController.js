import UsersService from "../services/UserService.js";
import { buildFilters } from "../utils/buildFilters.js";
import { getPagination, getOrder } from "../utils/pagination.js";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários do sistema
 */


class UsersController {

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Lista usuários com paginação e filtros
     *     tags: [Users]
     *     parameters:
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *       - in: query
     *         name: email
     *         schema:
     *           type: string
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Lista de usuários
     */

    async index(req, res) {
        const where = buildFilters(req.query, ["name", "email"]);

        const { limit, offset } = getPagination(req.query);
        const order = getOrder(req.query.sort, ["name", "email", "createdAt"]);

        const data = await UsersService.list({ where, order, limit, offset });
        return res.json(data);
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Retorna um usuário pelo ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *     responses:
     *       200:
     *         description: Usuário encontrado
     *       404:
     *         description: Usuário não encontrado
     */

    async show(req, res) {
        const user = await UsersService.get(
            req.params.id
        );
        return res.json(user);
    }

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Cria um novo usuário
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [name, email, password]
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               passwordConfirmation:
     *                 type: string
     *               role:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuário criado
     */

    async create(req, res) {
        console.log("DummyJob");
        const user = await UsersService.create(
            req.body
        );

        return res.status(201).json(user);
    }

    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     summary: Atualiza um usuário pelo ID
     *     tags: [Users]
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
     *             required: [name, email, password]
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               passwordConfirmation:
     *                 type: string
     *               role:
     *                 type: string
     *     responses:
     *       200:
     *         description: Usuário atualizado
     */

    async update(req, res) {
        const { id } = req.params;

        const user = await UsersService.update({
            id,
            data: req.body,
        });

        return res.json(user);
    }

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Exclui um usuário pelo ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *     responses:
     *       204:
     *         description: Usuário excluído
     */

    async delete(req, res) {
        await UsersService.remove(req.params.id);
        return res.status(204).send();
    }
}

export default new UsersController();
