import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "Documentação da API usando Swagger",
        },
        servers: [
        {
            url: "http://localhost:3000",
        },
        ],
    },
    apis: ["./src/app/controllers/*.js"],
});
