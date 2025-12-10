import jwt from "jsonwebtoken";

export function generateToken(id = 1) {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: process.env.EXPIRESIN,
    });
}
