import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default async (req, res, next) => {
    // Verifica se o token de autenticação foi fornecido
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token was not provided.' });
    }

    const [ , token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
    
        req.userId = decoded.id;

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalid.' });
    }
};