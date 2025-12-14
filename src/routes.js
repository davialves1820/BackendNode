import { Router } from 'express';
import multer from "multer";
import multerConfig from "./config/multer.js";

import auth from './app/middlewares/auth.js';
import role from './app/middlewares/role.js';
import { ROLES } from './app/constants/roles.js';

import CustomersController from './app/controllers/CustomersController.js';
import ContactController from './app/controllers/ContactController.js';
import UsersController from './app/controllers/UserController.js';
import SessionsController from './app/controllers/SessionsController.js';
import FilesController from "./app/controllers/FilesController.js";
import { createContactSchema, updateContactSchema } from './app/validators/contact.schema.js';
import validate from './app/middlewares/validate.js';
import HealthController from "./app/controllers/HealthController.js";

const routes = new Router();
const upload = multer(multerConfig);

// Public routes
routes.post("/sessions", SessionsController.create);
routes.get("/health", HealthController.index);

// Apply authentication to all routes below
routes.use(auth);

// Customers routes
routes.get("/customers", CustomersController.index);
routes.get("/customers/:id", CustomersController.show);
routes.post("/customers", role([ROLES.ADMIN, ROLES.MANAGER]), CustomersController.create);
routes.put("/customers/:id", role([ROLES.ADMIN, ROLES.MANAGER]), CustomersController.update);
routes.delete("/customers/:id", role([ROLES.ADMIN]), CustomersController.delete);

// Contacts routes
routes.get("/customers/:customerId/contacts", ContactController.index);
routes.get("/customers/:customerId/contacts/:id", ContactController.show);
routes.post(
    "/customers/:customerId/contacts",
    role([ROLES.ADMIN]),
    validate(createContactSchema),
    ContactController.create
);

routes.put(
    "/customers/:customerId/contacts/:id",
    role([ROLES.ADMIN, ROLES.MANAGER]),
    validate(updateContactSchema),
    ContactController.update
);
routes.delete("/customers/:customerId/contacts/:id", role([ROLES.ADMIN, ROLES.MANAGER]), ContactController.delete);

// Users routes
routes.get("/users", role([ROLES.ADMIN]), UsersController.index);
routes.get("/users/:id", role([ROLES.ADMIN]), UsersController.show);
routes.post("/users", UsersController.create);
routes.put("/users/:id", role([ROLES.ADMIN]), UsersController.update);
routes.delete("/users/:id", role([ROLES.ADMIN]), UsersController.delete);

// File upload
routes.post("/file", upload.single("file"), role([ROLES.ADMIN, ROLES.MANAGER]), FilesController.create);

export default routes;
