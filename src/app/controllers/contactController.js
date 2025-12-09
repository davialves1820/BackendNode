import * as Yup from 'yup';
import { Op } from 'sequelize';
import { ParseIso } from "date-fns";
import Contact from '../models/Contact';
import Customer from '../models/customer';

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Endpoints de contatos vinculados a clientes
 */


class ContactController {
    // List all customers
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
     *         schema:
     *           type: integer
     *         description: ID do cliente
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *       - in: query
     *         name: email
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Lista de contatos
     *       500:
     *         description: Erro interno
     */

        async index(req, res) {
            const {name, email, status, createdBefore, createdAfter, updatedBefore, updatedAfter, sort} = req.query;
    
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 25;
            
            let where = {customer_id: req.params.customerId};
            let order = [];
    
            if (name) {
                where = { ...where, name: {
                    [Op.iLike]: name,
                } };
            }
    
            if (email) {
                where = { ...where, email: {
                    [Op.iLike]: email,
                } };
            }
    
            if (status) {
                where = { ...where, status: {
                    [Op.in]: status.split(',').map(item => item.toUpperCase()),
                } };
            }
    
            if (createdBefore) {
                where = { ...where, createdAt: {
                    [Op.gte]: ParseIso(createdBefore),
                } };
            }
    
            if (createdAfter) {
                where = { ...where, createdAt: {
                    [Op.gte]: ParseIso(createdAfter),
                } };
            }
    
            if (updatedBefore) {
                where = { ...where, updateAt: {
                    [Op.gte]: ParseIso(updatedBefore),
                } };
            }
    
            if (updatedAfter) {
                where = { ...where, updateAt: {
                    [Op.gte]: ParseIso(updatedAfter),
                } };
            }
    
            if (sort) {
                order = sort.split(',').map(item => item.split(':'));
            }
    
            try {
                const data = await Contact.findAll({
                    where,
                    include: [
                        {
                            model: Customer,
                            as: 'customer',
                            attributes: ['id', 'status'],
                            required: true,
                        },
                    ],
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
    
        // Show a specific customer by ID
        //  localhost:3000/customers/1/contacts
        /**
         * @swagger
         * /customers/{customerId}/contacts/{id}:
         *   get:
         *     summary: Obtém um contato pelo ID
         *     tags: [Contacts]
         *     parameters:
         *       - in: path
         *         name: customerId
         *         required: true
         *         schema:
         *           type: integer
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Contato encontrado
         *       404:
         *         description: Contato não encontrado
         */

        async show(req, res) {
            try {
                /*const contact = await Contact.findByPk(req.params.id, {
                    include: [
                        {
                            model: Customer,
                            as: 'customer'
                        }
                    ],
                });*/

                const contact = await Contact.findOne({
                    where: {
                        customer_id: req.params.customerId,
                        id: req.params.id,
                    },
                    attributes: { exclude: ['customer_id', "customerId"] },
                });
    
                if (!contact) {
                    return res.status(404).json({ error: 'Customer not found' });
                }
    
                return res.status(200).json(contact); // Retorna o cliente criado com status 201
            } catch (err) {
                return res.status(500).json({
                    error: err?.message,
                    original: err?.original,
                });
            }
        }
    
        // Create a new customer
        /**
         * @swagger
         * /customers/{customerId}/contacts:
         *   post:
         *     summary: Cria um novo contato
         *     tags: [Contacts]
         *     parameters:
         *       - in: path
         *         name: customerId
         *         required: true
         *         schema:
         *           type: integer
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
         *               status:
         *                 type: string
         *     responses:
         *       200:
         *         description: Contato criado
         *       409:
         *         description: Email já existente
         */

        async create(req, res) {
            try {
                const schema = Yup.object().shape({
                    name: Yup.string().required(),
                    email: Yup.string().email().required(),
                    status: Yup.string().uppercase(),
            });

                await schema.validate(req.body, { abortEarly: false });

                // Verifica se já existe contato com esse email
                const contactExists = await Contact.findOne({
                    where: { email: req.body.email },
                });

                if (contactExists) {
                    return res.status(409).json({
                        error: 'Já existe um contato com este e-mail.',
                    });
                }

                // Cria o contato corretamente
                const contact = await Contact.create({
                    customer_id: req.params.customerId,
                    ...req.body,
                });

                return res.status(200).json(contact);
            } catch (err) {
                // Trata erro de unique constraint como fallback
                if (err.original?.code === '23505') {
                    return res.status(409).json({
                        error: 'Já existe um contato com este e-mail.',
                    });
                }

                return res.status(500).json({
                    error: err.message,
                    original: err.original,
                });
            }
        }

    
        // Update an existing customer by ID
        /**
         * @swagger
         * /customers/{customerId}/contacts/{id}:
         *   put:
         *     summary: Atualiza um contato existente
         *     tags: [Contacts]
         *     parameters:
         *       - in: path
         *         name: customerId
         *         required: true
         *       - in: path
         *         name: id
         *         required: true
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *     responses:
         *       200:
         *         description: Contato atualizado
         *       404:
         *         description: Contato não encontrado
         */

        async update(req, res) {
            try {
                const schema = Yup.object().shape({
                    name: Yup.string(),
                    email: Yup.string().email(),
                    status: Yup.string().uppercase(),
                });
    
                await schema.validate(req.body, { abortEarly: false });
    
                const contact = await Contact.findOne({
                    where: { 
                        customer_id: req.params.customerId,
                        id: req.params.id,
                    },
                    attributes: { exclude: ['customer_id', "customerId"] },
                });
    
                if (!contact) {
                    return res.status(404).json({ error: 'Customer not found' });
                }
    
                await contact.update(req.body);
    
                return res.status(200).json(contact);
            } catch (err) {
                return res.status(500).json({
                    error: err?.message,
                    original: err?.original,
                });
            }
        }  
    
        // Delete a customer by ID
        /**
         * @swagger
         * /customers/{customerId}/contacts/{id}:
         *   delete:
         *     summary: Remove um contato
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
         *         description: Contato deletado
         *       404:
         *         description: Contato não encontrado
         */

        async delete(req, res) {
    
            try {
                const contact = await Contact.findOne({
                    where: { 
                        customer_id: req.params.customerId,
                        id: req.params.id,
                    },
                    attributes: { exclude: ['customer_id', "customerId"] },
                });
    
                if (!contact) {
                    return res.status(404).json({ error: 'Customer not found' });
                }
    
                await contact.destroy();
    
                return res.status(200).json("customer deleted");
            } catch (err) {
                return res.status(500).json({
                    error: err?.message,
                    original: err?.original,
                });
            }
        }
}

export default new ContactController();