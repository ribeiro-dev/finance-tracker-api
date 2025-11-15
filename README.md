# 💰 Personal Finance Tracker API

[![Built with AdonisJS](https://img.shields.io/badge/Built%20with-AdonisJS-5A45FF?logo=adonisjs)](https://adonisjs.com)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

Uma REST API criada com AdonisJS (e Typescript), para gerenciar finanças pessoais - incluindo transações, categorias e relatórios

Seguindo uma arquitetura limpa e escalável, e também as convenções do AdonisJS para controllers, services e validators

## 🚀 Features

- 🔐 Autenticação JWT  
- 🗂 CRUD de categorias e transações  
- 📊 Relatórios por categoria e intervalo de datas
- 🧱 Arquitetura escalável
- 💾 Banco de dados SQLite

## 🧱 Estrutura do Projeto

```text
app/
├── controllers/      # Lida com as requisições
├── enums/
├── exceptions/
├── interfaces/
├── middleware/
├── models/
├── services/         # Comunicação com o banco de dados
├── utils/
├── validators/
│
├── config/
├── database/         # Migrations e seeders
├── start/
│   ├── env.ts
│   ├── kernel.ts
│   └── routes.ts     # Definição de rotas da API
│
├── tests/
│
├── .env.example
├── ace.js
├── adonisrc.ts
├── package.json
├── tsconfig.json
└── README.md

```

---

## ⚙️ Setup

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/ribeiro-dev/finance-tracker-api.git
cd finance-tracker-api
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configuração do ambiente

Copie o arquivo de exemplo e ajuste para seu ambiente:

```bash
cp .env.example .env
```

### 4️⃣ Rode as migrations

```bash
node ace migration:run
```

### 5️⃣ Rode a API

```bash
npm run dev
```

Quando estiver rodando, voce pode acessar:

- API URL → `http://localhost:3333/health`

Se tudo estiver funcionando, a API deve retornar um JSON:

```json
{
  hello: 'world',
}
```

---

## 📊 Exemplos de Endpoints

| Method | Endpoint | Description |
|-------|-----------------------|-------------|
| `POST`| `/auth/login`         | Login and recebimento do token JWT |
| `GET` | `/categories`         | Lista categorias do usuário |
| `POST`| `/categories`         | Cria uma nova categoria |
| `GET` | `/transactions`       | Lista transações do usuário |
| `POST`| `/transactions`       | Cria uma nova transação |
| `GET` | `/reports/summary`    | Obtém a renda total, despesas e saldo |
| `GET` | `/reports/categories` | Obtém despesas por categoria |

---

## 🧠 Destaques do Design

- **Arquitetura Limpa e Escalável** → fácil de escalar conforme necessidade de novas features
- **Injeção de Dependência** → via AdonisJS IoC container  
- **Lucid ORM** → para modelagem e relações do banco de dados
- **Validação & DTOs** → usando a biblioteca Vine.JS

---

## 🐳 Docker

> _Em breve_
