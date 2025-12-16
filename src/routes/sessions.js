import { Router } from "express";
import SessionsController from "../app/controllers/SessionsController.js";

const routes = new Router();

routes.post("/sessions", SessionsController.create);

export default routes;