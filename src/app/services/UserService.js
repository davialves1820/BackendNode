import Queue from "../../lib/Queue.js";
import AppError from "../errors/AppError.js";
import DummyJob from "../jobs/DummyJob.js";
import WelcomeEmailJob from "../jobs/WelcomeEmailJob.js";
import UserRepository from "../repositories/UserRepository.js";

class UserService {
    async list(filters) {
        return UserRepository.findAll(filters);
    }

    async get(id) {
        const user = await UserRepository.findByPk(id);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    }

    async create(data) {
        try {
            const user = await UserRepository.create(data);

            await Queue.add(DummyJob.key, { message: "HELLO JOBS" });
            await Queue.add(WelcomeEmailJob.key, { name: user.name, email: user.email });
            console.log("Chamou EMAIL");

            return user;
        } catch (err) {
            console.error(err);
        }
    }

    async update({ id, data }) {
        const user = await UserRepository.findByPk(id);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        await user.update(data);

        return user;
    }

    async remove(id) {
        const user = await this.get(id);
        await UserRepository.delete(user);
    }
}

export default new UserService();
