### Subir o docker
docker compose -f docker-compose.test.yml up -d

### Rodar os testes
npm run test

arquitetura de camadas:
Controller → Service → Repository → Model

MVC + Service Layer

HTTP
 ↓
Controller        (camada de apresentação / interface)
 ↓
Service           (camada de aplicação / regra de negócio)
 ↓
Repository        (camada de acesso a dados)
 ↓
Model (Sequelize) (camada de persistência)
