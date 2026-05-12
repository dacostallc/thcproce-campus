# Exportar Cannabis 101 do Moodle (legado `/escola`)

Objetivo: obter **lista de secções/módulos**, **URLs** e, quando possível, **texto das atividades “Página”**, para alinhar ou repovoar `lessonBodies.ts` sem copiar manualmente no browser.

## 1. Moodle — funções no serviço externo

No mesmo serviço onde já existe o token do campus, acrescente ao utilizador técnico:

| Função | Uso |
|--------|-----|
| `core_course_get_contents` | Obrigatória — outline do curso (secções, nomes, URLs, descrição curta). |
| `mod_page_get_pages_by_courses` | Recomendada — devolve `intro` e `content` (HTML) das atividades tipo **Página**. Sem isto, muitos módulos vêm só com nome + URL. |

Guia geral: [MOODLE_WEBSERVICES.md](./MOODLE_WEBSERVICES.md).

## 2. Variáveis de ambiente

Na raiz do projeto (`.env` ou `.env.local`), confirme:

```bash
MOODLE_WS_TOKEN=...
# URL que o servidor Node alcança (se /escola estiver bloqueado no edge, use hostname interno):
# MOODLE_WS_BASE_URL=https://…/escola
NEXT_PUBLIC_MOODLE_BASE_URL=https://thcproce.com.br/escola

# Um dos dois para o ID numérico do curso Cannabis 101 no Moodle:
NEXT_PUBLIC_MOODLE_CANNABIS101_COURSE_ID=123
# ou
MOODLE_COURSE_MAP={"cannabis-101":123}
```

O ID é o `id=` em `course/view.php?id=…`.

## 3. Correr o export

```bash
node scripts/moodle-export-cannabis101.mjs
```

- Escreve **`docs/moodle-export/cannabis-101.json`**.
- `--stdout` imprime JSON para pipe/redirecionamento.

## 4. Próximo passo editorial

O JSON **não substitui** automaticamente o painel do campus: serve de **fonte para revisão** e cópia formal para `src/content/courses/cannabis-101/lessonBodies.ts` (ou futuro pipeline). O campus continua a ler texto estático até essa migração estar fechada.

## 5. Git

`docs/moodle-export/` pode conter dados internos — avalie `.gitignore` local se não quiser versionar o dump.
