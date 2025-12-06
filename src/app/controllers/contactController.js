import * as Yup from 'yup';
import { Op } from 'sequelize';
import { ParseIso } from "date-fns";
import Contact from '../models/Contact';
import Customer from '../models/customer';

class ContactsController {
    // List all customers
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
                where = { ...where, createdAt: {
                    [Op.gte]: ParseIso(updatedBefore),
                } };
            }
    
            if (updatedAfter) {
                where = { ...where, createdAt: {
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
                            attributes: ['id', 'status'],
                            required: true,
                        },
                    ],
                    order,
                    limit,
                    offset: limit * page - limit,
                });
                return res.json(data);
            } catch (error) {
                return res.status(500).json({
                    error: err?.message,
                    original: err?.original,
                });
            }
        }
    
        // Show a specific customer by ID
        //  localhost:3000/customers/1/contacts
        async show(req, res) {
            try {
                const contact = await Contact.findByPk(req.params.id);
    
                if (!contact) {
                    return res.status(404).json({ error: 'Customer not found' });
                }
    
                return res.json(contact); // Retorna o cliente criado com status 201
            } catch (error) {
                return res.status(500).json({
                    error: err?.message,
                    original: err?.original,
                });
            }
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
        async update(req, res) {
            try {
                const schema = Yup.object().shape({
                    name: Yup.string(),
                    email: Yup.string().email(),
                    status: Yup.string().uppercase(),
                });
    
                await schema.validate(req.body, { abortEarly: false });
    
                const customer = await Customer.findByPk(req.params.id);
    
                if (!customer) {
                    return res.status(404).json({ error: 'Customer not found' });
                }
    
                await customer.update(req.body);
    
                return res.status(201).json(customer);
            } catch (err) {
                return res.status(500).json({
                    error: err?.message,
                    original: err?.original,
                });
            }
        }  
    
        // Delete a customer by ID
        async delete(req, res) {
    
            try {
                const customer = await Customer.findByPk(req.params.id);
    
                if (!customer) {
                    return res.status(404).json({ error: 'Customer not found' });
                }
    
                await customer.destroy();
    
                return res.status(201).json("customer deleted");
            } catch (err) {
                return res.status(500).json({
                    error: err?.message,
                    original: err?.original,
                });
            }
        }
}

export default new ContactsController();