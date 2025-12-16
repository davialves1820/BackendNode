import { Router } from 'express';
import multer from "multer";
import multerConfig from "../config/multer.js";
import role from '../app/middlewares/role.js';
import { ROLES } from '../app/constants/roles.js';
import FilesController from "../app/controllers/FilesController.js";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/file", upload.single("file"), role([ROLES.ADMIN, ROLES.MANAGER]), FilesController.create);

export default routes;