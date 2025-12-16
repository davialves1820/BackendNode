import { Router } from 'express';
import auth from '../app/middlewares/auth.js';
import userRoutes from './user.js';
import customerRoutes from './customers.js';
import contactRoutes from './contacts.js';
import sessionRoutes from './sessions.js';
import fileRoutes from './file.js';
import healthRoutes from './health.js';

const routes = new Router();

// Public routes
routes.use(healthRoutes);
routes.use(sessionRoutes);

// Protected routes
routes.use(auth);

routes.use(userRoutes);
routes.use(customerRoutes);
routes.use(contactRoutes);
routes.use(fileRoutes);

export default routes;