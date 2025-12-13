export default (schema, property = "body") => {
    return async (req, res, next) => {
        try {
            await schema.validate(req[property], {
                abortEarly: false,
                stripUnknown: true,
            });
            return next();
        } catch (err) {
            return res.status(400).json({
                error: "Validation failed",
                details: err.errors,
            });
        }
    };
};
