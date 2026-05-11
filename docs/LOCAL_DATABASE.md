# Base de dados PostgreSQL local

Para desenvolvimento e validação E2E (ex.: `docs/GAMIFICATION_E2E_CHECKLIST.md`), o repositório inclui **`docker-compose.yml`** na raiz com Postgres 16.

## Credenciais e porta (desenvolvimento)

| Campo   | Valor              |
|---------|--------------------|
| Host    | `127.0.0.1`        |
| Porta   | `5432`             |
| Utilizador | `postgres`      |
| Senha   | `postgres`         |
| Base    | `thcproce_campus`  |

A `DATABASE_URL` / `DIRECT_URL` em `.env.example` já seguem este formato:

`postgresql://postgres:postgres@127.0.0.1:5432/thcproce_campus`

Copie de `.env.example` para `.env` e confirme que **`DIRECT_URL`** está definido (o Prisma exige-no `schema.prisma`).

## Subir o Postgres

Na raiz do projecto (`thcproce-campus`):

```bash
docker compose up -d
```

Verificar que o contentor está a correr (nome do serviço: `db`).

Parar sem apagar dados:

```bash
docker compose stop
```

> **Nota:** Os dados ficam no volume Docker `thcproce_pgdata`. Não executar `docker compose down -v` a menos que pretenda **apagar** o volume com autorização explícita.

## Aplicar schema e dados iniciais

```bash
npx prisma db push
npm run db:seed
```

- `db push` sincroniza o schema Prisma com a base local (sem operações destrutivas por omissão além do que o Prisma aplicar ao schema).
- `db:seed` é opcional mas recomendado para missões e itens cosméticos base (`prisma/seed.cjs`).

### Migrations versionadas (`migrate`)

Para ambientes que devem seguir o histórico em `prisma/migrations/` (recomendado em **produção** após adoptar migrations):

```bash
npm run db:migrate:deploy
```

(Equivalente a `npx prisma migrate deploy` — usa `DATABASE_URL` / `DIRECT_URL` do `.env` ou das variáveis na Vercel.)

No **Build Command** da Vercel use **`npm run build`** (o `vercel.json` do repo fixa isto). **Não** encadeie `prisma migrate deploy && npm run build` no painel enquanto o histórico de migrations não estiver alinhado com a BD de produção — isso faz o deploy falhar se objectos já existirem (bases criadas antes com `db push`).

Para aplicar migrations em produção, faça **uma vez** a partir de uma máquina com `DATABASE_URL` / `DIRECT_URL` da produção:

```bash
npm run db:migrate:deploy
```

Se aparecer erro de objecto já existente, veja [`prisma migrate resolve`](https://www.pris.ly/d/migrate-resolve) ou execute só o SQL necessário (ex.: `20260510160000_profile_avatar_symbolic` usa `IF NOT EXISTS` em `avatarType` / `avatarColor`).

## Arrancar a aplicação

```bash
npm run dev
```

(Porta por omissão do projecto: **3030**, salvo configuração contrária.)

## Repetir validação E2E

1. Garantir Postgres no ar (`docker compose up -d`).
2. `.env` com `DATABASE_URL` e `DIRECT_URL` correctos.
3. `npx prisma db push` e `npm run db:seed`.
4. `npm run dev`.
5. Seguir `docs/GAMIFICATION_E2E_CHECKLIST.md` (admin, `CAMPUS_DB_LESSONS`, aluno, perfil, referral).

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Compose) instalado e em execução.
