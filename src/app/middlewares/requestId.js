import { randomUUID } from "crypto";

export default (req, res, next) => {
    req.requestId = randomUUID();
    res.setHeader("X-Request-Id", req.requestId);
    next();
};
