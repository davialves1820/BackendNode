import { Router } from 'express'
import customers from './app/controllers/CustomersController'
import contacts from './app/controllers/ContactController'
import users from './app/controllers/UserController'
import sessions from './app/controllers/SessionsController'
import files from "./app/controllers/FilesController"
import auth from './app/middlewares/auth'
import multer from "multer"
import multerConfig from "./config/multer"

const routes = new Router();
const upload = multer(multerConfig);

// Session routes
routes.post("/sessions", sessions.create);
routes.use(auth); // Apply authentication middleware to all routes below

// Define routes here
routes.get("/customers", customers.index);
routes.get("/customers/:id", customers.show);
routes.post("/customers", customers.create);
routes.put("/customers/:id", customers.update);
routes.delete("/customers/:id", customers.delete);

// Define contacts routes here
routes.get("/customers/:customerId/contacts", contacts.index);
routes.get("/customers/:customerId/contacts/:id", contacts.show);
routes.post("/customers/:customerId/contacts", contacts.create);
routes.put("/customers/:customerId/contacts/:id", contacts.update);
routes.delete("/customers/:customerId/contacts/:id", contacts.delete);

// Define routes here
routes.get("/users", users.index);
routes.get("/users/:id", users.show);
routes.post("/users", users.create);
routes.put("/users/:id", users.update);
routes.delete("/users/:id", users.delete);

// Files
routes.post("/file", upload.single("file") , files.create);

export default routes;