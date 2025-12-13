import { v4 as uuid } from "uuid";
import logger from "../../config/logger.js";

export default (req, res, next) => {
    const requestId = uuid();

    req.requestId = requestId;

    logger.info({
        requestId,
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
    });

    next();
};
