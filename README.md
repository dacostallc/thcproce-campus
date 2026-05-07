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

## Publicar na Vercel

O Prisma está em **PostgreSQL** (SQLite `file:` não funciona em produção serverless). Antes do primeiro deploy, cria uma base (ex.: [Neon](https://neon.tech)) e aplica o schema:

```bash
# com DATABASE_URL da Neon no .env ou na shell
npx prisma db push
```

Repositório Git: se ainda não existir, na pasta do projeto:

```bash
git init
git add .
git commit -m "Campus THCProce — deploy"
```

Cria o repositório no GitHub/GitLab e `git remote add origin ...` + `git push -u origin main`.

Na [Vercel](https://vercel.com): **Add New Project** → importa o repo → Framework Next.js (detetado). O ficheiro `vercel.json` fixa região `gru1` (São Paulo).

**Variáveis de ambiente na Vercel (mínimo para não quebrar auth + API):**

| Variável | Obrigatória? | Notas |
|----------|--------------|--------|
| `DATABASE_URL` | Sim | Connection string PostgreSQL (Neon pooled ou direct; com SSL se o host exigir). |
| `NEXTAUTH_URL` | Sim | URL pública do site, ex. `https://teu-projeto.vercel.app` ou domínio custom. |
| `NEXTAUTH_SECRET` | Sim | Segredo forte, ex. `openssl rand -base64 32`. |
| `NEXT_PUBLIC_MOODLE_BASE_URL` | Recomendada | URL base da escola Moodle (links e WS). |

**Opcionais** (podes deixar vazio): Bunny (`BUNNY_*`, `NEXT_PUBLIC_BUNNY_*`), Mux, Supabase, Sentry, tokens Moodle (`MOODLE_WS_TOKEN`, etc.), OAuth Moodle, `NEXT_PUBLIC_MUX_DEMO_PLAYBACK_ID`, `NEXT_PUBLIC_DEFAULT_DEMO_YOUTUBE_VIDEO_ID`. O campus **reproduz aulas** com fallback YouTube público se nada de Mux/Bunny estiver definido.

**Comando seguro para publicar:** depois de `npm run build` local passar e de teres colocado as env na Vercel + `prisma db push` na base remota:

- Se o projeto já está ligado ao Git: **faz push da branch** → a Vercel faz deploy sozinha.
- Ou, com [Vercel CLI](https://vercel.com/docs/cli): `npx vercel` (preview) e `npx vercel --prod` (produção), na pasta do projeto e autenticado (`npx vercel login`).

**Postgres local (opcional):** com Docker instalado, `docker compose up -d` e o `DATABASE_URL` de `.env.example`.
