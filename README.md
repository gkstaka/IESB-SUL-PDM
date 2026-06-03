# IESB-SUL-PDM — Gestão Financeira

App de controle financeiro pessoal em React Native / Expo com backend Express + Prisma + MySQL.

---

## Estrutura

```
praticas/
  gestao-financeira/       # app mobile (Expo)
  gestao-financeira-api/   # API REST (Express + Prisma)
```

---

## 1. API — gestao-financeira-api

### Pré-requisitos

- Node.js 18+
- MySQL rodando localmente

### Instalação

```bash
cd praticas/gestao-financeira-api

npm install prisma@5.22.0 @prisma/client@5.22.0 --force
npm install express cors zod dotenv @prisma/client
npm install --save-dev prisma nodemon
npm install --force
cp .env.example .env
```

Edite o `./praticas/gestao-financeira/.env`:

```env
DATABASE_URL=mysql://root:senha@localhost:3306/gestao_financeira
PORT=3000
JWT_SECRET='token-retornado-de-/auth/dev/token'     ####-se-necessario
DEFAULT_USER_EMAIL=admin@gestao.com
DEFAULT_USER_PASSWORD=admin123
DEFAULT_USER_NAME=Admin
```

Edite o `./praticas/gestao-financeira-api/.env`:
```env
DATABASE_URL="mysql://root:Senha10adaps@localhost:3306/gestao_financeira"
PORT=3000
JWT_SECRET='token-retornado-de-/auth/dev/token-se-necessario'
DEFAULT_USER_EMAIL="admin@gestao.com"
DEFAULT_USER_PASSWORD="admin123"
DEFAULT_USER_NAME="Usuário Padrão"
```

Para rodar na máquina do IESB, utilizar a senha "iesb"

### Banco de dados

No banco de dados, executar a criação do schema
```
CREATE DATABASE gestao_financeira CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
npx prisma init --datasource-provider mysql # se der erro, tentar rodar os comandos abaixo e fazer o teste se criou as tabelas
npx prisma migrate dev --name init   # cria as tabelas
npm run prisma:seed                  # popula com usuário e categorias padrão
```

### Rodar

```bash
npm run dev    # inicia com nodemon na porta definida em PORT (padrão 3000)
```

---

## 2. App — gestao-financeira

### Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`) ou usar `npx expo`
- App **Expo Go** no celular ou emulador Android/iOS

### Instalação

```bash
cd praticas/gestao-financeira
npm install
```
### Rodar

```bash
npx expo start
```
---

## 3. Endpoints da API

Base URL: `http://localhost:3000`

### Visão geral

| Método | Caminho | Bearer token? |
|--------|---------|:-------------:|
| GET | `/` | Não
| POST | `/auth/register` | Não |
| POST | `/auth/login` | Não |
| GET | `/auth/dev/token` | Não |
| GET | `/categories` | **Sim** |
| POST | `/categories` | **Sim** |
| PUT | `/categories/:id` | **Sim** |
| DELETE | `/categories/:id` | **Sim** |
| GET | `/transactions` | **Sim** |
| POST | `/transactions` | **Sim** |
| PUT | `/transactions/:id` | **Sim** |
| DELETE | `/transactions/:id` | **Sim** |

Rotas que exigem token devem enviar a autenticação:
```
Authorization: Bearer <token>
```

---

### Health check

#### `GET /` - sem token

### Auth

#### `POST /auth/register` — sem token
Cria uma nova conta.

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "minhasenha"
}
```

Resposta `201`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtcG9xeGltMTAwMDRic2JudWhzY3EzNmsiLCJlbWFpbCI6ImpvYW9AZW1haWwuY29tIiwibmFtZSI6Ikpvw6NvIFNpbHZhIiwiaWF0IjoxNzc5OTI3NTkwLCJleHAiOjE3ODA1MzIzOTB9.1omhq_fO5lROmVOGh67zNIQAaxMqIJhNfH-s2Nre20U",
  "user": {
    "id": "cmpoqxim10004bsbnuhscq36k",
    "email": "joao@email.com",
    "name": "João Silva"
  }
}
```

---

#### `POST /auth/login` — sem token
Autentica usuário, login e retorna token.

```json
{
  "email": "joao@email.com",
  "password": "minhasenha"
}
```

Resposta `200`:
```json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtcG5iaGw5azAwMDV6aXkwczMydmNnbmciLCJlbWFpbCI6ImFkbWluQGdlc3Rhby5jb20iLCJuYW1lIjoiVXN1w6FyaW8gUGFkcsOjbyIsImlhdCI6MTc3OTkyNzMyMiwiZXhwIjoxNzgwNTMyMTIyfQ.tghsvzey209LDlIPF8s03llPeDBEmHrU_5CHd0eUmDE",
  "user": {
    "id": "cmpnbhl9k0005ziy0s32vcgng",
    "email": "admin@gestao.com",
    "name": "Usuário Padrão"
}
}
```

---

#### `GET /auth/dev/token` — sem token
Retorna token do usuário seed (só pra testes).

Resposta `200`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtcG5iaGw5azAwMDV6aXkwczMydmNnbmciLCJlbWFpbCI6ImFkbWluQGdlc3Rhby5jb20iLCJuYW1lIjoiVXN1w6FyaW8gUGFkcsOjbyIsImlhdCI6MTc3OTkyNzMyNSwiZXhwIjoxNzgwNTMyMTI1fQ.Q9-o_k1ufjvRU8lVvSIYx72i2Crtas3FDadCOMH-7oo",
  "usage": "Authorization: Bearer <token>",
  "expires_in": "7d"
}
```

---

### Categorias

#### `GET /categories` — requer Bearer token
Lista categorias padrão + personalizadas do usuário autenticado. Sem body.

Resposta `200`:
```json
[
  {
    "id": "cmpnbhl7m0001ziy0p5hi5i3j",
    "name": "food",
    "displayName": "Alimentação",
    "icon": "fastfood",
    "background": "#DEA17B",
    "isIncome": false,
    "isDefault": true,
    "userId": null,
    "createdAt": "2026-05-27T00:19:46.978Z",
    "updatedAt": "2026-05-27T00:19:46.978Z"
  }
]
```

---

#### `POST /categories` — requer Bearer token
Cria uma categoria personalizada.

```json
{
	"name": "vg",
	"displayName": "vg",
	"icon": "favorite",
	"background": "#FFB6B6",
	"isIncome": false
}
```

Resposta `201`:
```json
{
  "id": "cmpor51cb0008bsbn5qs992pu",
  "name": "vgs",
  "displayName": "vg",
  "icon": "favorite",
  "background": "#FFB6B6",
  "isIncome": false,
  "isDefault": false,
  "userId": "cmpnbhl9k0005ziy0s32vcgng",
  "createdAt": "2026-05-28T00:25:41.388Z",
  "updatedAt": "2026-05-28T00:25:41.388Z"
}
```

---

#### `PUT /categories/:id` — requer Bearer token
Troque :id pelo id retornado da /categories
Edita uma categoria personalizada (categorias padrão retornam `403`). Todos os campos são opcionais.

```json
{
  "displayName": "Animais de Estimação",
  "background": "#B2EBF2"
}
```

Resposta `200`: 
```json
{
    "id": "cmpor51cb0008bsbn5qs992pu",
    "name": "vgs",
    "displayName": "Saúde e Bem-estar",
    "icon": "favorite",
    "background": "#FFB6B6",
    "isIncome": false,
    "isDefault": false,
    "userId": "cmpnbhl9k0005ziy0s32vcgng",
    "createdAt": "2026-05-28T00:25:41.388Z",
    "updatedAt": "2026-05-28T00:26:24.490Z"
}
```

---

#### `DELETE /categories/:id` — requer Bearer token
Troque :id pelo id retornado da /categories
Exclui uma categoria personalizada. Categorias padrão retornam `400`. Sem body.

Resposta `204` (sem body).

---

### Transações

#### `GET /transactions` — requer Bearer token
Lista transações do usuário. Aceita query params para filtrar período.

| Query param | Exemplo | Comportamento |
|---|---|---|
| `month` + `year` | `?month=5&year=2026` | Maio de 2026 |
| `year` | `?year=2026` | Ano inteiro |
| *(sem params)* | — | Todas as transações |

Resposta `200`:
```json
[
  {
    "id": "...",
    "description": "Mercado",
    "value": 150.75,
    "date": "2026-05-10T00:00:00.000Z",
    "categoryId": "...",
    "userId": "...",
    "category": { "id": "...", "displayName": "Alimentação", ... }
  }
]
```

---

#### `POST /transactions` — requer Bearer token
Cria uma transação. Necessário trocar categoryId por um id válido retornado de /categories

```json
{
  "description": "Salário de outubeeero",
  "value": 35002.50,
  "date": "2026-04-29",
  "categoryId": "cmpnbhl7f0000ziy0pufw0f9m"
}
```

Resposta `201`:
```json
{
    "id": "cmporbdsp000absbnuj0pt635",
    "description": "Salário de outubeeero",
    "value": "35002.5",
    "date": "2026-04-29T00:00:00.000Z",
    "categoryId": "cmpnbhl7f0000ziy0pufw0f9m",
    "userId": "cmpnbhl9k0005ziy0s32vcgng",
    "createdAt": "2026-05-28T00:30:37.464Z",
    "updatedAt": "2026-05-28T00:30:37.464Z",
    "category": {
        "id": "cmpnbhl7f0000ziy0pufw0f9m",
        "name": "income",
        "displayName": "Renda",
        "icon": "work",
        "background": "#DE9AC3",
        "isIncome": true,
        "isDefault": true,
        "userId": null,
        "createdAt": "2026-05-27T00:19:46.972Z",
        "updatedAt": "2026-05-27T00:19:46.972Z"
    }
}
```

---

#### `PUT /transactions/:id` — requer Bearer token
Troque :id pelo id retornado da /transactions
Edita uma transação. Todos os campos são opcionais.

```json
{
  "description": "Mercado semanal",
  "value": 200.00
}
```

Resposta `200`: 
```json
{
  "id": "cmpndmnf4000bi3vg6zomjz40",
  "description": "Saúde e Bem-estar",
  "value": "3500.5",
  "date": "2026-04-29T00:00:00.000Z",
  "categoryId": "cmpnbhl7m0001ziy0p5hi5i3j",
  "userId": "cmpnbhl9k0005ziy0s32vcgng",
  "createdAt": "2026-05-27T01:19:42.352Z",
  "updatedAt": "2026-05-28T00:34:30.310Z",
  "category": {
    "id": "cmpnbhl7m0001ziy0p5hi5i3j",
    "name": "food",
    "displayName": "Alimentação",
    "icon": "fastfood",
    "background": "#DEA17B",
    "isIncome": false,
    "isDefault": true,
    "userId": null,
    "createdAt": "2026-05-27T00:19:46.978Z",
    "updatedAt": "2026-05-27T00:19:46.978Z"
  }
}
```

---

#### `DELETE /transactions/:id` — requer Bearer token
Troque :id pelo id retornado da /transactions

Resposta `204` (sem body).
