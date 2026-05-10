# THCProce — Campus Interativo

Plataforma educacional premium da Escola PROCBD: campus virtual estilo SimCity
sobre cannabis medicinal, cultivo, extrações, culinária e indústria.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + design system custom (glassmorphism, glows)
- Framer Motion para animações
- Lucide React para ícones

## Rodando local

```bash
npm install
npm run dev
```

Abre em `http://localhost:3030`.

**Terminal integrado**: se o cwd for outra pasta (ex.: `~\.cursor\plans`), faz primeiro `cd` até **este** repositório antes de `npm install` / `npm run dev`. No PowerShell, **não** uses `cd %USERPROFILE%\...` — esse `%VAR%` é sintaxe `cmd`; em PS usa por exemplo `Set-Location ~\thcproce-campus`. Se mantiveres shim no workspace Cursor (ficheiros `campus-dev-launcher.*` + `scripts/run-next-dev.cjs` em `plans`), podes definir `TH_CAMPUS_ROOT` com o caminho absoluto deste clone.

### Fluxo oficial de deploy (Git → Vercel)

1. **Fonte da verdade:** commits na branch principal (**`main`**) no GitHub.
2. **Produção:** push para `origin/main` → a Vercel faz **deploy automático** do projeto ligado ao repo (não uses o CLI como fluxo principal).
3. **Domínio:** confirma no dashboard Vercel que **`campus.thcproce.com.br`** está associado **a este projeto** e que **Production Branch** = `main` + **Auto-deploy** activo.
4. **`vercel.json`** neste repo fixa **Next.js** e região **`gru1`** — não alteres sem alinhamento com infra.

### Checklist obrigatório antes de push / produção

```bash
npm run typecheck
npm run build
git status   # working tree limpo (sem ficheiros que deviam estar no .gitignore)
git commit …
git push origin main
```

Depois: abre o deployment na Vercel → **Ready** → valida `campus.thcproce.com.br` (ou preview).

### Mensagens em destaque no mapa / Cine THC (Prof THC · admin)

Só admins (e-mails configurados em `NEXT_PUBLIC_CAMPUS_ADMIN_EMAILS`) podem enviar um **balão dourado (~5 s)** acima do avatar, **acima do overlay do cinema** mas **abaixo do painel do chat**:

- **`Ctrl`** + **`Shift`** + **`B`** — abre o compositor e envia o texto.
- Ou no **chat do campus**, mensagem que **começa com `!`** (ex.: `!Intervalo às 21h`) → o texto **mantém o `!` no histórico do chat**, mas o **balão mostra apenas o texto sem os `!` iniciais** (ex.: `Intervalo às 21h`).

Rotas:

- `/` — landing page premium com CTA pro campus
- `/campus` — mapa interativo (a "alma" do projeto)

## Adicionar a imagem do campus

Salve a vista aérea cinematográfica em:

```
public/campus/aerial.webp
```

Veja `public/campus/README.txt` para detalhes.

## Estrutura

```
src/
├── app/
│   ├── layout.tsx           Layout raiz, fonts, metadata
│   ├── globals.css          Tailwind + utilitários (glass, glows)
│   ├── page.tsx             Landing page
│   └── campus/page.tsx      Página do mapa
├── components/
│   └── campus/
│       ├── CampusMap.tsx    Container principal (imagem + hotspots + HUD + painel)
│       ├── Hotspot.tsx      Hotspot interativo de uma área
│       ├── AmbientLife.tsx  Vida ambiente CSS (drones, vagalumes, luzes)
│       ├── CoursePanel.tsx  Painel lateral premium da sala/curso
│       └── HUD.tsx          Top bar + status flutuante
├── data/
│   └── courses.ts           Dados das 14 áreas + posições dos hotspots
└── lib/
    └── utils.ts             cn() helper
```

## Próximos passos (fora deste MVP visual)

- Avatar do aluno andando livremente pelo mapa (PixiJS)
- Multiplayer realtime (Supabase Realtime): outros alunos visíveis + chat
- SSO contra o Moodle existente em thcproce.com.br/escola
- Player de vídeo Mux/Bunny com sincronia de progresso
- Gamificação (XP, badges, níveis Semente → Master Grower)

Plano completo em `c:\Users\sdelv\.cursor\plans\campus-interativo-thcproce_*.plan.md`.

## Deploy na Vercel (primeira vez ou revisão)

O Prisma em produção usa **PostgreSQL** (SQLite local não serve em serverless). Primeira base: ex. [Neon](https://neon.tech), depois:

```bash
npx prisma db push
```

Na [Vercel](https://vercel.com): projeto ligado ao **GitHub** deste repo → **Production Branch** `main` → deploy automático em cada push.

### Variáveis de ambiente (resumo)

| Variável | Obrigatória? | Notas |
|----------|--------------|--------|
| `DATABASE_URL` | Sim | PostgreSQL (Neon, etc.). |
| `NEXTAUTH_URL` | Sim | URL pública (ex. `https://campus.thcproce.com.br`). |
| `NEXTAUTH_SECRET` | Sim | Ex.: `openssl rand -base64 32`. |
| `NEXT_PUBLIC_MOODLE_BASE_URL` | Recomendada | Base Moodle da escola. |

**Opcionais:** Bunny, Mux, Supabase, Sentry, Moodle WS/OAuth, demos YouTube/Mux — ver `.env.example` quando existir.

### Vercel CLI (secundário)

Reserva **`npx vercel` / `npx vercel --prod`** para previews pontuais ou troubleshooting. O repo inclui **`.vercelignore`** para não enviar `node_modules` nem caches no uplink; mesmo assim o fluxo **oficial** é **Git push** (evita limites de tamanho e divergência com o que está em produção).

**Postgres local (opcional):** `docker compose up -d` + `DATABASE_URL` conforme `.env.example`.
