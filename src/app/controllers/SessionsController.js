import User from "../models/User";
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Login e geração de token
 */

class SessionsController {

    /**
     * @swagger
     * /sessions:
     *   post:
     *     summary: Login do usuário
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login bem-sucedido
     *       401:
     *         description: Credenciais inválidas
     */
    async create(req, res) {
        // Faz o login e gera o token do usuário
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        const { id, name } = user;

        return res.status(200).json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, process.env.SECRET, {
                expiresIn: process.env.EXPIRESIN,
            }),
        });
    }

}

export default new SessionsController();