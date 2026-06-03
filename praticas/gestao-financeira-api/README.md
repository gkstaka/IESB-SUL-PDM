# gestao-financeira-api

API REST do app de controle financeiro, feita com Express + Prisma + MySQL.

Rotas de `/categories` e `/transactions` exigem `Authorization: Bearer <token>`.


## Como rodar

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

`.env` necessário:

```env
DATABASE_URL=mysql://root:senha@localhost:3306/gestao_financeira
PORT=3000
JWT_SECRET='token-retornado-de-/auth/dev/token-se-necessario'
DEFAULT_USER_EMAIL=admin@gestao.com
DEFAULT_USER_PASSWORD=admin123
DEFAULT_USER_NAME=Admin
```

## Endpoints

**Abertos:**
- `POST /auth/register` — criar conta
- `POST /auth/login` — login, retorna token
- `POST /auth/refresh` — renova token (precisa de token válido)
- `GET /auth/dev/token` — token do usuário seed (só pra testes)

**Autenticados:**
- `GET /categories` — lista padrão + personalizadas do usuário
- `POST /categories` — criar
- `PUT /categories/:id` — editar (bloqueado em categorias padrão)
- `DELETE /categories/:id` — excluir (bloqueado em categorias padrão)
- `GET /transactions?month=5&year=2026` — listar (filtro opcional)
- `POST /transactions` — criar
- `PUT /transactions/:id` — editar
- `DELETE /transactions/:id` — excluir

## Scripts

```bash
npm run dev             # nodemon
npm run prisma:seed     # popular banco
npm run prisma:studio   # Prisma Studio na :5555
npm run prisma:migrate  # nova migration
```
