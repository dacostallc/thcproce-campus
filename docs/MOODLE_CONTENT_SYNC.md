# Sincronização de conteúdo Moodle → CMS (Prisma)

Fluxo: **fetch Moodle (WS)** → **ContentBlock** (`PARAGRAPH` + `moodleFullSync`) → **`lessonFromDb`** → **`buildPanelLessonRichContent`** → **ClassroomLessonView** (UI inalterada).

## Variáveis de ambiente

| Variável | Uso |
|----------|-----|
| `MOODLE_WS_TOKEN` | Token do serviço web Moodle (só servidor). |
| `MOODLE_WS_BASE_URL` ou `NEXT_PUBLIC_MOODLE_BASE_URL` | Base REST do Moodle (`…/escola`). |
| `CAMPUS_DB_LESSONS` | Liga `areaId` + `lessonIndex` aos slugs Prisma `courseSlug|moduleSlug|lessonSlug`. |
| `NEXT_PUBLIC_CAMPUS_ADMIN_EMAILS` | E-mails que podem chamar a rota admin de sync. |

Nada de token ou segredos é guardado no JSON do bloco — só `courseId`, `cmid`, `source`, `charCount`, `title`, `syncedAt`.

## Funções WS no Moodle

Activar no **serviço externo** ligado ao token (exemplos):

- `core_course_get_contents`
- `mod_page_get_pages_by_courses`
- `mod_book_get_books_by_courses`
- `mod_lesson_get_pages`
- `mod_lesson_get_page_data`
- `mod_lesson_get_lessons_by_courses`
- `mod_resource_get_resources_by_courses`
- `mod_label_get_labels_by_courses`
- `mod_url_get_urls_by_courses`

Lista também em `.env.example` junto ao painel de pré-visualização `GET /api/moodle/full-content`.

## Rota de sync

**POST** `/api/admin/moodle/sync-lesson-content`

- Sessão: utilizador em `NEXT_PUBLIC_CAMPUS_ADMIN_EMAILS`.
- Corpo JSON:

```json
{
  "courseId": 12,
  "cmid": 456,
  "areaId": "cannabis-101",
  "lessonIndex": 0
}
```

- `courseId` / `cmid`: curso e módulo de curso Moodle (ver pré-visualização ou URL `mod/...`).
- `areaId` / `lessonIndex`: slot do painel; têm de existir em `CAMPUS_DB_LESSONS`.

### Exemplo com `curl` (sessão cookie NextAuth)

```bash
curl -X POST http://localhost:3030/api/admin/moodle/sync-lesson-content \
  -H "Content-Type: application/json" \
  -b "next-auth.session-token=..." \
  -d "{\"courseId\":12,\"cmid\":456,\"areaId\":\"cannabis-101\",\"lessonIndex\":0}"
```

(Substituir cookie pelo da sessão real do admin.)

## Onde o conteúdo é guardado

- Modelo **`ContentBlock`**, tipo **`PARAGRAPH`**, `sortOrder: -1000` (acima dos blocos editoriais por defeito).
- Campo **`data`** (JSON):
  - `text`: texto limpo para a sala e leitores.
  - `html`: HTML sanitizado (opcional; admin / futuro).
  - `moodleFullSync`: `{ courseId, cmid, source, charCount, title?, syncedAt }`.

Re-sync **apaga** apenas blocos `PARAGRAPH` que já tenham `moodleFullSync`; restantes blocos não são removidos.

## Prioridade na sala focada

1. Texto canónico dos blocos CMS — se existir `moodleFullSync`, **só** esses blocos entram no corpo (não mistura com outros parágrafos do mesmo `lesson`).
2. `moodleLessonSnippet` (descrição do módulo), quando activo no curso.
3. Legado TypeScript (`lessonBodies` / gerador), fallback.

Em desenvolvimento, o painel mostra `Fonte do conteúdo` incluindo `cms_blocks:moodle_page`, etc.

## Limitações

- **Book:** WS do núcleo expõe sobretudo a introdução; capítulos completos podem ficar incompletos (aviso no fetch).
- **Resource:** conteúdo principal pode ser ficheiro; só se persiste a intro disponível via WS.
- **Publicação:** curso, módulo e aula têm de estar **`PUBLISHED`** no Prisma para o campus ler a aula.

## Pré-visualização técnica

`GET /api/moodle/full-content?courseId=&cmid=` (admin) — ver código em `src/app/api/moodle/full-content/route.ts`.
