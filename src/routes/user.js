import { Router } from "express";
import { ROLES } from "../app/constants/roles.js";
import role from "../app/middlewares/role.js";
import validate from "../app/middlewares/validate.js";
import UsersController from "../app/controllers/userController.js";
import { createUserSchema, updateUserSchema } from "../app/validators/user.schema.js";

const routes = new Router();

routes.get("/users", role([ROLES.ADMIN]), UsersController.index);
routes.get("/users/:id", role([ROLES.ADMIN]), UsersController.show);
routes.post("/users", role([ROLES.ADMIN]), validate(createUserSchema), UsersController.create);
routes.put("/users/:id", role([ROLES.ADMIN]), validate(updateUserSchema), UsersController.update);
routes.delete("/users/:id", role([ROLES.ADMIN]), UsersController.delete);

export default routes;