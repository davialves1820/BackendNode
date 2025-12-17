export default class AppError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.statusCode = status;
        Error.captureStackTrace(this, this.constructor);
    }
}
