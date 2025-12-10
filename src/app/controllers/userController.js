import * as Yup from 'yup';
import { Op } from 'sequelize';
import { ParseIso } from "date-fns";
import User from '../models/User';
import Mail from "../../lib/Mail";

class UserController {

    /**
     * @swagger
     * tags:
     *   - name: Users
     *     description: CRUD de usuários
     */

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Lista usuários com filtros, paginação e ordenação
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
     *         name: createdBefore
     *         schema:
     *           type: string
     *           format: date-time
     *       - in: query
     *         name: createdAfter
     *         schema:
     *           type: string
     *           format: date-time
     *       - in: query
     *         name: updatedBefore
     *         schema:
     *           type: string
     *           format: date-time
     *       - in: query
     *         name: updatedAfter
     *         schema:
     *           type: string
     *           format: date-time
     *       - in: query
     *         name: sort
     *         description: "Exemplo: name:asc,email:desc"
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
     *       500:
     *         description: Erro interno
     */
    async index(req, res) {
        const {name, email, createdBefore, createdAfter, updatedBefore, updatedAfter, sort} = req.query;
    
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 25;
        
        let where = {};
        let order = [];
    
        if (name) {
            where = { ...where, name: { [Op.iLike]: name }};
        }
    
        if (email) {
            where = { ...where, email: { [Op.iLike]: email }};
        }
    
        if (createdBefore) {
            where = { ...where, createdAt: { [Op.lte]: ParseIso(createdBefore) }};
        }
    
        if (createdAfter) {
            where = { ...where, createdAt: { [Op.gte]: ParseIso(createdAfter) }};
        }
    
        if (updatedBefore) {
            where = { ...where, updateAt: { [Op.gte]: ParseIso(updatedBefore) }};
        }
    
        if (updatedAfter) {
            where = { ...where, updateAt: { [Op.gte]: ParseIso(updatedAfter) }};
        }
    
        if (sort) {
            order = sort.split(',').map(item => item.split(':'));
        }
    
        try {
            const data = await User.findAll({
                attributes: { exclude: ['password', 'password_hash', 'file_id'] },
                where,
                order,
                limit,
                offset: limit * page - limit,
            });
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({
                error: err?.message,
                original: err?.original,
            });
        }
    }


    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Mostra um usuário específico
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Dados do usuário
     *       404:
     *         description: Usuário não encontrado
     */
    async show(req, res) {
        try {
            const user = await User.findByPk(req.params.id, { exclude: ['password', 'password_hash'] });

            if (!user) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            const {id, name, email, file_id, createdAt, updatedAt} = user;
    
            return res.status(200).json({id, name, email, file_id, createdAt, updatedAt});
        } catch (err) {
            return res.status(500).json({
                error: err?.message,
                original: err?.original,
            });
        }
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
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               passwordConfirmation:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuário criado
     *       409:
     *         description: E-mail já cadastrado
     *       400:
     *         description: Falha de validação
     */
    async create(req, res) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                email: Yup.string().email().required(),
                password: Yup.string().required().min(8),
                passwordConfirmation: Yup.string().when('password', (password, field) =>
                    password ? field.required().oneOf([Yup.ref('password')]) : field
                ),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Validation fails' });
            }

            const {id, name, email, createdAt, updatedAt} = await User.create(req.body);

            Mail.send({
                to: email,
                subject: "Bem-vindo(a)",
                text: `Olá ${name}, bem vindo ao nosso sistema.`,
            });

            return res.status(200).json({id, name, email, createdAt, updatedAt});
        } catch (err) {
            if (err.original?.code === '23505') {
                return res.status(409).json({ error: 'Esse usuário já existe.' });
            }

            return res.status(500).json({
                error: err.message,
                original: err.original,
            });
        }
    }


    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     summary: Atualiza um usuário existente
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Usuário atualizado
     *       404:
     *         description: Usuário não encontrado
     *       401:
     *         description: Senha antiga incorreta
     */
    async update(req, res) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string(),
                email: Yup.string().email(),
                file_id: Yup.number(),
                oldPassword: Yup.string().min(8),
                password: Yup.string().min(8).when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
                passwordConfirmation: Yup.string().when('password', (password, field) =>
                    password ? field.required().oneOf([Yup.ref('password')]) : field
                ),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Validation fails' });
            }

            const user = await User.findByPk(req.params.id);

            if (!user) return res.status(404).json({ error: 'User not found' });

            const { oldPassword } = req.body;

            if (oldPassword && !(await user.checkPassword(oldPassword))) {
                return res.status(401).json({ error: 'Password does not match' });
            }

            const {id, name, email, file_id, createdAt, updatedAt} = await user.update(req.body);

            return res.status(200).json({id, name, email, createdAt, updatedAt});
        } catch (err) {
            if (err.original?.code === '23505') {
                return res.status(409).json({ error: 'Esse usuário já existe.' });
            }

            return res.status(500).json({
                error: err.message,
                original: err.original,
            });
        }
    }


    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Remove um usuário
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Usuário removido
     *       404:
     *         description: Não encontrado
     */
    async delete(req, res) {
        try {
            const user = await User.findByPk(req.params.id);

            if (!user) return res.status(404).json({ error: 'User not found' });

            await user.destroy();

            return res.status(200).send();
        } catch (err) {
            return res.status(500).json({
                error: err?.message,
                original: err?.original,
            });
        }
    }
}

export default new UserController();
