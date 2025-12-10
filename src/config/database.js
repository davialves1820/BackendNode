import 'dotenv/config';

module.exports = {
    development: {
        dialect: "postgres",
        host: "localhost",
        port: 5432,
        username: String(process.env.DB_USER),
        password: String(process.env.DB_PASS),
        database: String(process.env.DB_NAME_DEVELOPMENT),
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
        },
    },

    test: {
        dialect: "postgres",
        host: "localhost",
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        logging: false,
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
        },
    },

    production: {
        dialect: "postgres",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
        },
    }
};