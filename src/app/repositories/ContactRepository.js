import Contact from "../models/contact.js";
import Customer from "../models/customer.js";

class ContactRepository {
    findAll({ where, order, limit, offset }) {
        return Contact.findAll({
            where,
            order,
            limit,
            offset,
            include: [{
                model: Customer,
                as: "customer",
                attributes: ["id", "status"],
                required: true,
            }],
        });
    }

    findById(customerId, id) {
        return Contact.findOne({
            where: { id, customer_id: customerId },
        });
    }

    create(data) {
        return Contact.create(data);
    }

    delete(contact) {
        return contact.destroy();
    }
}

export default new ContactRepository();
