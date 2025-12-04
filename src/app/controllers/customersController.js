import * as Yup from 'yup';
import { Op } from 'sequelize';
import { ParseIso } from "date-fns";
import Customer from '../models/customer.js';
import Contact from '../models/Contact.js';

class customersController {

    // List all customers
    async index(req, res) {
        const {name, email, status, createdBefore, createdAfter, updatedBefore, updatedAfter, sort} = req.query;

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 25;
        
        let where = {};
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
            where = { ...where, createdAt: {
                [Op.gte]: ParseIso(updatedBefore),
            } };
        }

        if (updatedAfter) {
            where = { ...where, createdAt: {
                [Op.gte]: ParseIso(updatedAfter),
            } };
        }

        console.log(where);

        if (sort) {
            order = sort.split(',').map(item => item.split(':'));
        }

        try {
            const data = await Customer.findAll({
                where,
                include: [
                    {
                        model: Contact,
                        attributes: ['id', 'status'],
                    },
                ],
                order,
                limit,
                offset: limit * page - limit,
            });
            return res.json(data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
        
        
    }

    // Show a specific customer by ID
    async show(req, res) {
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        return res.json(customer); // Retorna o cliente criado com status 201
    }

    // Create a new customer
    async create(req, res) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                email: Yup.string().email().required(),
                status: Yup.string().required(),
            });

            await schema.validate(req.body, { abortEarly: false });

            const customer = await Customer.create({
                name: req.body.name,
                email: req.body.email,
                status: req.body.status,
            });

            return res.status(201).json(customer);
        } catch (err) {
            return res.status(500).json({
                error: err?.message,
                original: err?.original,
            });
        }
    }


    // Update an existing customer by ID
    update(req, res) {
        const id = parseInt(req.params.id); // Extrai o id dos parâmetros da rota
        const { name } = req.body; // Extrai o nome do corpo da requisição
        
        // Encontra o índice do cliente a ser atualizado
        const index = customers.findIndex(item => item.id === id);
        const status = index >= 0 ? 200 : 400; // Define o status com base na existência do cliente

        if (index >= 0) {
            customers[index].name = name; // Atualiza o nome do cliente
        }

        return res.status(status).json(customers[index]); // Retorna o cliente atualizado
    }  

    // Delete a customer by ID
    delete(req, res) {
        const id = parseInt(req.params.id); // Extrai o id dos parâmetros da rota
        const index = customers.findIndex(item => item.id === id); // Encontra o índice do cliente a ser deletado
        const status = index >= 0 ? 200 : 400; // Define o status com base na existência do cliente

        if (index >= 0) {
            customers.splice(index, 1); // Remove o cliente do array
        }

        return res.status(status).json(); // Retorna uma resposta vazia
    }
}

export default new customersController();