import { Router } from "express";
import HealthController from "../app/controllers/HealthController.js";

const routes = new Router();

routes.get("/health", HealthController.index);

export default routes;