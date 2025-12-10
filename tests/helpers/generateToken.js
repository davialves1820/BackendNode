import jwt from "jsonwebtoken";
import authConfig from "../../src/config/auth";

export function generateToken(id = 1) {
    return jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
    });
}
