import { Router } from "express";
import { ROLES } from "../app/constants/roles.js";
import role from "../app/middlewares/role.js";
import validate from "../app/middlewares/validate.js";
import CustomersController from "../app/controllers/CustomersController.js";
import { createCustomersSchema, updateCustomersSchema } from "../app/validators/customers.schema.js";

const routes = new Router();

routes.get("/customers", CustomersController.index);
routes.get("/customers/:id", CustomersController.show);
routes.post("/customers", role([ROLES.ADMIN, ROLES.MANAGER]), validate(createCustomersSchema), CustomersController.create);
routes.put("/customers/:id", role([ROLES.ADMIN, ROLES.MANAGER]), validate(updateCustomersSchema), CustomersController.update);
routes.delete("/customers/:id", role([ROLES.ADMIN]), CustomersController.delete);

export default routes;