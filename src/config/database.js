module.exports = {
    dialect: "postgres",
    host: "localhost",
    username: "postgres",
    password: "davi.2005",
    database: "learnNode",
    define: {
        timestamps: true, // Adiciona os campos createdAt e updatedAt automaticamente
        underscored: true, // Usa snake_case em vez de camelCase para os nomes dos campos
        underscoredAll: true, // Usa snake_case em vez de camelCase para todos os nomes
    },
};