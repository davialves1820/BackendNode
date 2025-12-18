# 📦 Projeto Node.js – Arquitetura e Organização

Este projeto é uma **API RESTful** desenvolvida em **Node.js** utilizando **Express**, **Sequelize**, **PostgreSQL**, **Redis (Bee-Queue)** e boas práticas de **arquitetura em camadas**.

O objetivo principal é manter um código **escalável**, **testável** e **de fácil manutenção**, separando claramente responsabilidades entre controllers, services, repositories e infraestrutura.

---

## 🏗️ Visão Geral da Arquitetura

A aplicação segue um modelo inspirado em **Clean Architecture / Layered Architecture**, onde cada camada possui uma responsabilidade bem definida:

```
Request → Routes → Controllers → Services → Repositories → Models → Database
                             ↓
                           Jobs / Queues (Redis)
```

---

## 📁 Estrutura de Pastas

```
src
├── app
│   ├── constants
│   ├── controllers
│   ├── errors
│   ├── jobs
│   ├── middlewares
│   ├── models
│   ├── repositories
│   ├── services
│   ├── utils
│   └── validators
│
├── config
├── database
├── lib
├── routes
├── app.js
├── queue.js
└── server.js
```

---

## 📂 Camada `app`

### 📌 `controllers/`

Responsáveis por **receber a requisição HTTP** e **retornar a resposta**.

Características:

* Não contêm regra de negócio
* Apenas orquestram dados entre request e services
* Lidam com status HTTP e formato de resposta

Exemplos:

* `UsersController`
* `CustomersController`
* `ContactController`
* `SessionsController`
* `FilesController`
* `HealthController`

---

### 📌 `services/`

Contêm toda a **regra de negócio da aplicação**.

Responsabilidades:

* Validações de domínio
* Regras complexas
* Comunicação com repositories
* Disparo de jobs (filas)

---

### 📌 `repositories/`

Camada responsável por **acesso a dados**.

Características:

* Centraliza consultas ao banco
* Usa Sequelize Models
* Evita queries espalhadas pela aplicação

---

### 📌 `models/`

Definem as **entidades do sistema** usando Sequelize.

Responsabilidades:

* Estrutura das tabelas
* Relacionamentos
* Hooks
* Métodos de instância (ex: `checkPassword`)

---

### 📌 `jobs/`

Jobs assíncronos processados pelo **Bee-Queue**.

Usados para:

* Envio de e-mails (Mailtrap)
* Processamentos pesados
* Tarefas em background

Exemplo:

* `WelcomeEmailJob`

---

### 📌 `middlewares/`

Intermediários do Express.

Inclui:

* Autenticação JWT
* Autorização por role
* Tratamento global de erros
* **Logger customizado com requestId**

Cada requisição recebe um `X-Request-Id` para rastreabilidade.

---

### 📌 `utils/`

Funções utilitárias reutilizáveis.

Exemplos do projeto:

* `buildFilters` → filtros dinâmicos
* `pagination` → paginação e ordenação

---

### 📌 `validators/`

Validação de dados de entrada (ex: Joi / Yup).

---

### 📌 Upload de Arquivos

O upload é feito via **Multer**, com persistência dos metadados no banco de dados.

Endpoint:

```
POST /file
```

---

### 📌 Logs e Observabilidade

O projeto utiliza:

* **Winston** para logs estruturados
* **Morgan** para logs HTTP
* Middleware que gera um `requestId` único por requisição

Esses logs facilitam debug, auditoria e rastreabilidade.

---

### 📌 Testes Automatizados

A aplicação possui testes automatizados cobrindo:

* Controllers
* Services
* Regras de negócio

Utilizando **Jest** para garantir qualidade e regressão zero.

---

## 🧪 Testes Automatizados

O projeto conta com uma **estrutura de testes bem definida**, separando claramente **testes unitários**, **testes de integração** e **utilitários de suporte**, garantindo confiabilidade e facilidade de manutenção.

### 📁 Estrutura de Testes

```
tests
├── helpers
├── integration
├── unit
├── setup.js
└── teardown.js
```

### 🔹 Testes Unitários (`tests/unit`)

Responsáveis por validar **regras de negócio isoladas**, sem dependência de infraestrutura externa.

Características:

* Testam services, validators e utils
* Não dependem de banco ou Redis
* Execução rápida
* Facilitam refatorações seguras

### 🔹 Testes de Integração (`tests/integration`)

Validam o **fluxo completo da aplicação**, incluindo:

* Controllers
* Middlewares
* Banco de dados (PostgreSQL)
* Autenticação e autorização

Esses testes garantem que os componentes funcionam corretamente em conjunto.

### 🔹 Helpers (`tests/helpers`)

Contêm funções utilitárias reutilizáveis nos testes, como:

* Criação de usuários fake
* Geração de tokens JWT
* Payloads mockados
* Setup de cenários comuns

### ⚙️ `setup.js`

Executado **antes da suíte de testes**, responsável por:

* Inicializar variáveis de ambiente de teste
* Conectar ao banco de dados de teste
* Preparar mocks globais

### ⚙️ `teardown.js`

Executado **após a suíte de testes**, responsável por:

* Limpar dados do banco
* Encerrar conexões abertas
* Garantir isolamento entre execuções

### 🐳 Testes com Docker

Os testes de integração utilizam **Docker** para subir um banco PostgreSQL isolado, garantindo:

* Ambiente previsível
* Independência da máquina local
* Execução consistente no CI (GitHub Actions)

### 🧰 Ferramentas de Teste

* **Jest** – framework de testes
* **Supertest** – testes de API HTTP
* **Docker Compose** – infraestrutura de testes

### ✅ Benefícios

* Alta confiabilidade
* Redução de bugs em produção
* Facilidade de manutenção
* Confiança para evoluir o sistema

### Executar testes no terminal

```
npm run test
```

---

## 📂 Camada `lib`

Contém **infraestrutura compartilhada**.

### 🔹 `Queue.js`

Gerencia filas com **Bee-Queue + Redis**.

Responsabilidades:

* Inicializar filas
* Processar jobs
* Adicionar jobs
* Health check do Redis (`isRedisUp`)

---

## 📂 Camada `database`

Configuração e inicialização do **Sequelize**.

Inclui:

* Conexão com banco
* Migrations
* Seeds

---

## 📂 `routes/`

Define os endpoints da aplicação.

Exemplo:

```
/users → UsersController
/customers → CustomersController
/sessions → SessionsController
/health → HealthController
```

---

## ⚙️ Arquivos principais

### 📄 `app.js`

Configuração do Express:

* Middlewares globais
* Rotas
* Swagger
* Error Handler

---

### 📄 `server.js`

Ponto de entrada da aplicação.

Responsável por:

* Subir o servidor HTTP
* Iniciar filas (`Queue.processQueue()`)

---

### 📄 `queue.js`

Inicializa o processamento de jobs em background.

---

## 🩺 Health Check

Endpoint `/health` retorna o status dos serviços da aplicação:

```json
{
  "status": "ok",
  "services": {
    "api": "up",
    "database": "up",
    "redis": "up"
  }
}
```

Inclui verificações de:

* API
* Banco de dados (Sequelize)
* Redis (Bee-Queue)

Utilizado para:

* Monitoramento
* Docker
* Kubernetes

---

## 🔐 Autenticação e Autorização

* Autenticação baseada em **JWT**
* Login via endpoint `/sessions`
* Token contém `id` e `role`
* Controle de acesso por **roles** (ex: admin, user)
* Middlewares garantem proteção de rotas sensíveis

---

## 🐳 Docker e Containerização

O projeto utiliza **Docker** tanto para **execução da aplicação em ambiente de produção** quanto para **isolamento do ambiente de testes**, garantindo consistência entre desenvolvimento, CI e deploy.

### 🔹 Dockerfile (Build da aplicação)

O `Dockerfile` define como a imagem da API é construída:

* Utiliza a imagem base `node:18-alpine`, garantindo leveza e segurança
* Define `/app` como diretório de trabalho
* Instala dependências via `npm install`
* Copia todo o código-fonte para dentro da imagem
* Expõe a porta `3000`
* Inicia a aplicação com `npm start`

Esse processo gera uma imagem **imutável e reproduzível**, ideal para ambientes de produção.

---

### 🔹 Docker Compose (Ambiente de Produção)

O `docker-compose.yml` orquestra os serviços necessários para a aplicação:

* **API Node.js** (imagem publicada no Docker Hub)
* **PostgreSQL** como banco de dados relacional
* **Redis** para filas e processamento assíncrono

Características importantes:

* Variáveis de ambiente centralizadas
* Dependência explícita entre serviços (`depends_on`)
* Persistência de dados do PostgreSQL via volume (`pgdata`)
* Estratégia de restart automático (`unless-stopped`)

Essa abordagem facilita o deploy local ou em servidores sem necessidade de instalação manual de dependências.

---

### 🔹 Docker Compose para Testes Automatizados

O arquivo `docker-compose.test.yml` é usado exclusivamente para **ambiente de testes**:

* Sobe um **PostgreSQL isolado** para testes
* Utiliza porta diferente (`5433`) para evitar conflitos
* Possui **healthcheck**, garantindo que o banco esteja pronto antes da execução dos testes
* Volume dedicado (`pg_test_data`) para isolamento total

Isso garante que os testes:

* Não dependam de banco local
* Sejam reprodutíveis
* Não afetem dados de desenvolvimento ou produção

---

### 🔹 Integração com GitHub Actions (CI)

O pipeline de CI utiliza Docker para garantir testes confiáveis:

1. Sobe o banco de testes via Docker Compose
2. Aguarda o banco ficar saudável
3. Executa os testes automatizados com Jest
4. Derruba o ambiente de testes ao final

Após os testes:

* A imagem Docker da API é construída
* A imagem é publicada no **Docker Hub** com as tags:

  * `latest`
  * Hash do commit (`github.sha`)

Esse fluxo garante:

* Qualidade contínua
* Imagens versionadas
* Prontidão para deploy automatizado

---

## 📚 Documentação da API (Swagger)

A API possui documentação interativa gerada automaticamente com **Swagger (OpenAPI)**, facilitando o entendimento e o consumo dos endpoints tanto para desenvolvedores quanto para times externos.

### 🔎 O que está documentado

* Endpoints disponíveis
* Parâmetros de requisição (path, query e body)
* Estrutura de respostas
* Códigos de status HTTP
* Autenticação e exemplos de uso

### ▶️ Como acessar

Com a aplicação em execução, a documentação pode ser acessada em:

```
GET /docs
```

Exemplo:

```
http://localhost:3000/docs
```

A documentação é mantida próxima ao código, utilizando comentários `@swagger` diretamente nos **controllers**, garantindo que ela esteja sempre sincronizada com a implementação.

---

## 📦 Tecnologias Utilizadas

* Node.js
* Express
* Sequelize
* PostgreSQL
* Redis
* Bee-Queue
* JWT
* Docker
* Swagger
* **Mailtrap (envio de e-mails em ambiente de desenvolvimento)**
* **Multer (upload de arquivos)**
* **Winston + Morgan (logs estruturados)**
* **Jest (testes automatizados)**

---

## ✅ Benefícios da Arquitetura

* Separação clara de responsabilidades
* Código escalável
* Fácil manutenção
* Alta testabilidade
* Pronto para microsserviços
