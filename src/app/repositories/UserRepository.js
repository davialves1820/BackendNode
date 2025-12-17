import User from "../models/user.js";

class UserRepository {
    findAll({ where, order, limit, offset }) {
        return User.findAll({
            where,
            order,
            limit,
            offset,
            attributes: { exclude: ['password', 'password_hash', 'file_id'] },
        });
    }

    findByPk(id) {
        return User.findByPk(id, { attributes: { exclude: ['password', 'password_hash', 'file_id'] } });
    }

    create(data) {
        return User.create(data);
    }

    delete(user) {
        return user.destroy();
    }
}

export default new UserRepository();
