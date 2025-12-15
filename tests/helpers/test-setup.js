import database from "../../src/database/index.js";

beforeAll(async () => {
  // Conecta ao banco antes de tudo
  await database.connect();

  // Sincroniza os modelos
  await database.connection.sync({ force: true });
});

afterEach(async () => {
  // Limpa os dados após cada teste
  const { connection } = database;
  const models = Object.values(connection.models);

  for (const model of models) {
    await model.destroy({ where: {}, force: true });
  }
});

afterAll(async () => {
  // Fecha a conexão após todos os testes
  await database.connection.close();
});
