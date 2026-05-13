# Checklist operacional — Moodle + campus (local)

Use **`.env.local`** na raiz do projecto (Next.js carrega antes de `.env`). Não commits chaves.

---

## 1. Variáveis necessárias

### `MOODLE_WS_BASE_URL`

| | |
|---|---|
| **Formato** | URL absoluta da raiz do Moodle onde vive o endpoint REST, **sem** barra final. Costuma ser o mesmo host que `/webservice/rest/server.php`. |
| **Exemplo fictício** | `https://escola.exemplo.org/moodle` |
| **Onde obter o valor real** | URL que usas para aceder ao Moodle (Administrador → *Plugins* → *Web services* → vê o endpoint REST). Se o campus público for `https://.../escola`, confirma no servidor qual é o vhost que responde a `.../webservice/rest/server.php`. |

### `MOODLE_WS_TOKEN`

| | |
|---|---|
| **Formato** | String opaca gerada no Moodle para um **utilizador de serviço** (ou token manual) com as funções WS permitidas. |
| **Exemplo fictício** | `a1b2c3d4e5f6789...` (só letras/números, comprimento variável) |
| **Onde obter o valor real** | Moodle: *Administração do site* → *Servidor* → *Web services* → *Tokens* (ou criar utilizador dedicado + token no *App* / serviço personalizado). **Nunca** aparece no código do projecto—só no env. |

### `MOODLE_COURSE_MAP`

| | |
|---|---|
| **Formato** | JSON **numa linha**: mapa `areaId` (slug do campus em `src/data/courses.ts`) → **course id numérico** no Moodle. |
| **Exemplo fictício** | `{"cannabis-101": 42, "medicina": 55}` |
| **Onde obter o valor real** | No Moodle: abre o curso → URL costuma ter `id=` (course id), ou *Configurações do curso*. O slug `cannabis-101` deve coincidir com `Area.id` no projecto. Sem esta variável, o código usa fallback `100 + índice` da área (pode estar **errado**). |

### `MOODLE_MOCK_USER_ID` (recomendado para diagnóstico)

| | |
|---|---|
| **Formato** | Número inteiro: **userid** Moodle de um utilizador inscrito nos cursos a listar. |
| **Exemplo fictício** | `17` |
| **Onde obter o valor real** | Moodle: *Utilizadores* → perfil → id na URL ou relatório. O token WS muitas vezes está ligado a um user; podes usar o mesmo userid para `core_enrol_get_users_courses` no script de listagem. |

### `CAMPUS_DB_LESSONS`

| | |
|---|---|
| **Formato** | Várias entradas separadas por **vírgula**. Cada entrada: `areaId|lessonIndex|courseSlug|moduleSlug|lessonSlug` (5 segmentos com `\|`). |
| **Exemplo fictício** | `cannabis-101|0|cannabis-101|modulo-1|boas-vindas` |
| **Onde obter o valor real** | Slugs vêm do **CMS Prisma** (curso/módulo/aula **PUBLISHED**), iguais aos do admin em `/admin/courses/...`. `lessonIndex` é 0-based no painel do mapa. |

### `NEXT_PUBLIC_CAMPUS_ADMIN_EMAILS`

| | |
|---|---|
| **Formato** | Lista de e-mails separados por **vírgula** (minúsculas na prática). |
| **Exemplo fictício** | `tu@empresa.com`, ou `a@x.com,b@x.com` |
| **Onde obter o valor real** | O mesmo e-mail com que fazes login em NextAuth localmente; tem de bater com `session.user.email`. |

### Outras úteis

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_MOODLE_BASE_URL` | Fallback da base Moodle se `MOODLE_WS_BASE_URL` estiver vazio (ex.: `https://.../escola`). |
| `DATABASE_URL` / `DIRECT_URL` | Postgres para Prisma (`lessonFromDb`, sync futuro). |
| `NEXTAUTH_URL` | Ex.: `http://localhost:3030` em local. |
| `NEXTAUTH_SECRET` | Segredo da sessão (gerar string longa). |

---

## 2. Ordem sugerida de testes (sem sync)

1. Preencher `.env.local` com WS + mapa + (opcional) `MOODLE_MOCK_USER_ID` + admin emails.
2. `npx tsx scripts/list-moodle-course-modules.ts --courseId=<ID>` **ou** `--areaId=cannabis-101`.
3. Anotar **cmid** de uma atividade `page` (ou outro tipo suportado).
4. Com servidor a correr e sessão admin: `GET /api/moodle/full-content?courseId=...&cmid=...`.
5. Sync (`POST /api/admin/moodle/sync-lesson-content`) só quando quiseres gravar no CMS.

---

## 3. Funções WS (lembrete)

O token precisa ter permissões para pelo menos: `core_course_get_contents`, `core_course_get_courses_by_field` (nome do curso), `core_enrol_get_users_courses` (listagem sem `--courseId`), e para preview/sync completo as funções listadas em `docs/MOODLE_CONTENT_SYNC.md`.

---

## 4. Script de diagnóstico (só listagem)

```bash
npx tsx scripts/list-moodle-course-modules.ts
npx tsx scripts/list-moodle-course-modules.ts --areaId=cannabis-101
npx tsx scripts/list-moodle-course-modules.ts --courseId=12
```

Não imprime token. Ver `scripts/list-moodle-course-modules.ts`.
