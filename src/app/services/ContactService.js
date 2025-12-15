import AppError from "../errors/AppError.js";
import Contact from "../models/Contact.js";
import ContactRepository from "../repositories/ContactRepository.js";

class ContactService {
    async list(filters) {
        return ContactRepository.findAll(filters);
    }

    async get(customerId, id) {
        const contact = await ContactRepository.findById(customerId, id);
        if (!contact) throw new AppError("Contact not found", 404);
        return contact;
    }

    async create(customerId, data) {
        return ContactRepository.create({
            customer_id: customerId,
            ...data,
        });
    }

    async update({ customerId, id, data }) {
        const contact = await ContactRepository.findById(customerId, id);

        if (!contact) {
            throw new AppError("Contact not found", 404);
        }

        await contact.update(data);

        return contact;
    }

    async remove(customerId, id) {
        const contact = await this.get(customerId, id);
        await ContactRepository.delete(contact);
    }
}

export default new ContactService();
