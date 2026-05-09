# Checklist — validação ponta a ponta (CMS + gamificação)

Documento interno para QA manual. **Não** altera regras de recompensa; apenas descreve o fluxo esperado e pré-requisitos.

## Pré-requisitos

- `DATABASE_URL` / `DIRECT_URL` válidos; `npx prisma db push` aplicado no ambiente de teste.
  - **Postgres local:** ver `docs/LOCAL_DATABASE.md` (`docker compose up -d` na raiz do repo).
  - Se o Prisma reportar **P1012** (`DIRECT_URL` em falta), defina `DIRECT_URL` no `.env` (em Postgres local costuma ser igual a `DATABASE_URL`, como em `.env.example`).
- `npm run db:seed` (opcional mas recomendado: missões + itens cosméticos base).
- Servidor local: `npm run dev` (porta padrão **3030** se não alterou).
- Conta **admin** configurada (e-mail em `CAMPUS_ADMIN_EMAILS` ou equivalente já usado no projeto).
- Conta **aluno** (criada em `/inscrever-se` ou credenciais de teste).

## Convenção `CAMPUS_DB_LESSONS`

Formato por entrada (sem espaços nos segmentos críticos):

`areaId|índiceAula0based|slugCurso|slugModulo|slugAula`

- **areaId**: id da sala no mapa (ex.: `cannabis-101` — ver `src/data/courses.ts`, tipo `Area.id`).
- **índice**: zero-based, alinhado à lista de aulas dessa sala no painel do campus.
- **slugs**: devem coincidir **exatamente** com curso / módulo / aula no admin, com cadeia **PUBLISHED**.

Várias entradas: separar por vírgula.

Exemplo (ilustrativo — ajuste slugs ao que criar no admin):

```env
CAMPUS_DB_LESSONS=cannabis-101|0|piloto-e2e|modulo-1|aula-quiz
```

> Sem esta variável (ou com entrada errada), o passo 9 cai em conteúdo **legado** e o quiz do CMS pode não aparecer.

**Requisitos técnicos do piloto DB** (código em `resolveCampusLessonDbContent`):

- Curso, módulo e aula com status **PUBLISHED**.
- Blocos suportados no campus: `HEADING`, `PARAGRAPH`, `CALLOUT`, `VIDEO_EMBED`, `IMAGE`, `QUIZ_EMBED` (dados válidos pelo schema).
- Bloco `QUIZ_EMBED` com `quizId` do quiz **publicado** criado no admin.

---

## Parte A — Admin (ordem sugerida)

Marque cada linha após confirmar na UI ou na BD.

| # | Passo | URL / navegação | Notas de validação |
|---|--------|------------------|-------------------|
| 1 | Criar **curso** | `/admin/courses` → Novo curso | Definir **slug** memorável (ex.: `piloto-e2e`); publicar (**PUBLISHED**). |
| 2 | Criar **módulo** | Curso → Novo módulo | Slug único no curso; **PUBLISHED**. |
| 3 | Criar **aula** | Módulo → Nova aula | Slug único; **PUBLISHED**. |
| 4 | Criar **blocos** | Editar aula → blocos | Pelo menos um bloco de conteúdo + **QUIZ_EMBED** com `quizId` correto (após passo 5). |
| 5 | Criar **quiz** | Aula → Quizzes → Novo quiz | Publicar; perguntas `SINGLE_CHOICE` / `TRUE_FALSE`; percentual de aprovação coerente. |
| 6 | Criar **achievement** | `/admin/achievements` | Para desbloqueio automático no 1.º quiz, o **code** deve ser um dos códigos em `GAMIFICATION_ACHIEVEMENT_CODES` em `src/lib/services/gamification.ts` (ex.: `FIRST_QUIZ_PASSED`). Título/descrição livres. |
| 7 | Criar **missão** | `/admin/missions` | Ex.: `PASS_QUIZ` alvo 1, com pequena recompensa XP/souvenir — alinha com seed ou configure nova. |
| 8 | Criar **item cosmético** | `/admin/avatar-items` | `unlockAchievementCode` opcional; se ligar a `FIRST_QUIZ_PASSED`, desbloqueia com a conquista (ex.: insígnia). |
| 9 | Configurar **aula piloto** | `.env` → `CAMPUS_DB_LESSONS` | Reiniciar `npm run dev` após alterar env. Verificar que `areaId` + índice batem com a sala/aula aberta pelo aluno. |

> **Ordem prática bloco vs quiz:** criar o quiz (5), depois adicionar o bloco QUIZ_EMBED (4) com esse `quizId`, ou editar blocos após criar o quiz.

---

## Parte B — Aluno

| # | Passo | Verificação |
|---|--------|-------------|
| 10 | Aceder à **aula piloto** no campus | Abrir a sala (`areaId`), aula no índice mapeado; conteúdo deve vir do **CMS** (blocos DB), não só legado. |
| 11 | **Responder quiz** | Submeter com sessão iniciada; 1.ª **aprovação** nesse quiz paga gamificação (reaprovões não voltam a pagar). |
| 12 | **Ganhar XP** | XP base do quiz (`XP_REWARD_QUIZ_PASS` em `gamification.ts`) + XP de achievements, se aplicável. |
| 13 | **Ganhar souvenirCredits** | Créditos base do quiz + conquistas + missões. |
| 14 | **Desbloquear achievement** | Conquista aparece em `/perfil` e, se aplicável, histórico `ACHIEVEMENT_UNLOCK`. |
| 15 | **Concluir missão** | Após sincronização (ex.: visita a `/perfil` ou pós-quiz), missão mostra concluída; histórico `MISSION_COMPLETE` quando aplicável. |
| 16 | **Desbloquear cosmético** | Lista de cosméticos em `/perfil` inclui item ligado à conquista (`grantCosmeticItemsForAchievementCode`). |
| 17 | Ver **tudo em /perfil** | XP, nível, créditos, missões, conquistas, cosméticos, indicação (se aplicável). |
| 18 | Ver **histórico de recompensas** | Secção no `/perfil`: entradas `QUIZ_PASS`, `ACHIEVEMENT_UNLOCK`, `COSMETIC_UNLOCK`, `MISSION_COMPLETE`, etc., coerentes com os valores concedidos. |

---

## Parte C — Referral (opcional no mesmo ciclo)

| # | Passo | Verificação |
|---|--------|-------------|
| R1 | Aluno A copia link/código em `/perfil` | Código `referralCode` apresentado. |
| R2 | Novo aluno B inscreve-se em `/inscrever-se?ref=CODIGO` | Conta **nova** (e-mail inexistente). |
| R3 | Créditos | A e B recebem souvenir conforme `REFERRAL_REWARD_*`; histórico `REFERRAL_REFERRER` / `REFERRAL_RECIPIENT`. |

**Limitações já conhecidas:** re-inscrição com e-mail existente **não** aplica referral; indicação com o próprio e-mail é ignorada.

---

## Resolução de problemas (rápido)

| Sintoma | Hipótese |
|---------|----------|
| Aula continua “legado” | `CAMPUS_DB_LESSONS` vazio/errado; slugs não batem; algo **DRAFT** na cadeia. |
| Quiz não renderiza | Bloco `QUIZ_EMBED` inválido; quiz não publicado; `quizId` errado. |
| Sem achievement automático | Código da conquista na BD não está em `GAMIFICATION_ACHIEVEMENT_CODES` ou critério não cumprido (ex.: `passedCount`). |
| Missão não fecha | Missão inactiva; tipo/alvo não condiz com contagens reais; ver `missionsSync`. |
| Histórico vazio para evento antigo | `ProfileRewardLog` só existe após deploy da funcionalidade; eventos anteriores não são retroactivos. |

---

## Estado desta validação

- **Alinhamento com o código:** `resolveCampusLessonDbContent`, `submitQuizAction`, `applyQuizPassGamification`, `syncMissionsForProfile`, `ProfileRewardLog`, referral em `createEnrollmentProfile`.
- **Bugs corrigidos nesta fase (documentação apenas):** nenhum identificado no código durante a elaboração da checklist.
- **Riscos residuais:** `ProfileRewardLog` sem histórico retroactivo; `CAMPUS_DB_LESSONS` exige restart do servidor; falha P2034 em quiz serializável pode exigir novo envio.
