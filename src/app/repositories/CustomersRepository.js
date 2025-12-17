import Contact from "../models/contact.js";
import Customer from "../models/customer.js";

class CustomerRepository {
    findAll({ where, order, limit, offset }) {
        return Customer.findAll({
            where,
            order,
            limit,
            offset,
            include: [{
                model: Contact,
                as: "contacts",
                attributes: ["id", "status"],
                required: true,
            }],
        });
    }

    findByPk(id) {
        return Customer.findByPk(id);
    }

    create(data) {
        return Customer.create(data);
    }

    delete(customer) {
        return customer.destroy();
    }
}

export default new CustomerRepository();
