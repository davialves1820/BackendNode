import { Router } from "express";
import { ROLES } from "../app/constants/roles.js";
import role from "../app/middlewares/role.js";
import validate from "../app/middlewares/validate.js";
import ContactController from "../app/controllers/contactController.js";
import { createContactSchema, updateContactSchema } from "../app/validators/contact.schema.js";

const routes = new Router();

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

export default routes;
