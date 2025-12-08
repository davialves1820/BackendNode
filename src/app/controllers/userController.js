import * as Yup from 'yup';
import { Op } from 'sequelize';
import { ParseIso } from "date-fns";
import User from '../models/User';

class UserController {
    // List all customers
        async index(req, res) {
            const {name, email, createdBefore, createdAfter, updatedBefore, updatedAfter, sort} = req.query;
    
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
    
            if (createdBefore) {
                where = { ...where, createdAt: {
                    [Op.lte]: ParseIso(createdBefore),
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
                const data = await User.findAll({
                    attributes: { exclude: ['password', 'password_hash', 'file_id'] },
                    where,
                    order,
                    limit,
                    offset: limit * page - limit,
                });

                return res.json(data);
            } catch (err) {
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

                const user = await User.findByPk(req.params.id, { exclude: ['password', 'password_hash'] });

                const {id, name, email, file_id, createdAt, updatedAt} = user;

                if (!user) {
                    return res.status(404).json({ error: 'Customer not found' });
                }
    
                return res.json({id, name, email, file_id, createdAt, updatedAt}); // Retorna o cliente criado com status 201
            } catch (err) {
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
                    password: Yup.string().required().min(8),
                    passwordConfirmation: Yup.string().when('password', (password, field) =>
                        password ? field.required().oneOf([Yup.ref('password')]) : field
                    ),
            });

                if (!(await schema.isValid(req.body))) {
                    return res.status(400).json({ error: 'Validation fails' });
                }

                // Cria o contato corretamente
                const {id, name, email, createdAt, updatedAt} = await User.create(req.body);

                return res.status(201).json({id, name, email, createdAt, updatedAt});
            } catch (err) {
                // Trata erro de unique constraint como fallback
                if (err.original?.code === '23505') {
                    return res.status(409).json({
                        error: 'Esse usuário já existe.',
                    });
                }

                return res.status(500).json({
                    error: err.message,
                    original: err.original,
                });
            }
        }
    
        // Update an existing customer by ID
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
                    console.log(req.body);
                    return res.status(400).json({ error: 'Validation fails' });
                }

                const user = await User.findByPk(req.params.id);

                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                const { oldPassword } = req.body;

                if (oldPassword && !(await user.checkPassword(oldPassword))) {
                    return res.status(401).json({ error: 'Password does not match' });
                }

                // Atualiza o user
                const {id, name, email, file_id, createdAt, updatedAt} = await user.update(req.body);

                return res.status(201).json({id, name, email, createdAt, updatedAt});
            } catch (err) {
                // Trata erro de unique constraint como fallback
                if (err.original?.code === '23505') {
                    return res.status(409).json({
                        error: 'Esse usuário já existe.',
                    });
                }

                return res.status(500).json({
                    error: err.message,
                    original: err.original,
                });
            }
        }  
    
        // Delete a customer by ID
        async delete(req, res) {
            try {
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            await user.destroy();

            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({
                error: err?.message,
                original: err?.original,
            });
        }
    }
}

export default new UserController();