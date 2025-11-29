import { Router } from 'express'
import customers from './app/controllers/customersController'

const routes = new Router();



// Define routes here
routes.get("/customers", customers.index);
routes.get("/customers/:id", customers.show);
routes.post("/customers", customers.create);
routes.put("/customers/:id", customers.update);
routes.delete("/customers/:id", customers.delete);




export default routes;