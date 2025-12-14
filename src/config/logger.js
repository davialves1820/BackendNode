import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Console
        new winston.transports.Console(),

        // Arquivo
        new winston.transports.File({
            filename: "logs/app.log",
        }),
    ],
});

export default logger;
