import AppError from "../errors/AppError.js";
import logger from "../../config/logger.js";

export default (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.status).json({ error: err.message });
    }

    /*logger.error({
        requestId: req.requestId,
        message: err.message,
        stack: err.stack,
    });*/

    return res.status(500).json({
        error: "Internal server error",
        requestId: req.requestId,
    });
};
