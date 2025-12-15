import crypto from "crypto";
import logger from "../../config/logger.js";

export default (req, res, next) => {
    const requestId = crypto.randomUUID();

    req.requestId = requestId;

    logger.info({
        requestId,
        method: req.method,
        path: req.originalUrl,
        time: new Date().toISOString(),
    });

    res.setHeader("X-Request-Id", requestId);

    next();
};
