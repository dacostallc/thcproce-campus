# Deploy na Netlify

Este projeto e um app Next.js 14 com App Router, API routes, middleware e Prisma/Postgres.
A Netlify usa o adapter OpenNext automaticamente para Next.js 13.5+, entao nao fixe
`@netlify/plugin-nextjs` no `package.json` a menos que um log de deploy peca isso explicitamente.

## Configuracao do site

No dashboard da Netlify, importe o repositorio Git e confira:

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `20`

O arquivo `netlify.toml` ja define esses valores.

## Variaveis obrigatorias

Copie as variaveis de producao que hoje estao na Vercel para:
`Site configuration > Environment variables`.

Minimo para o campus funcionar em producao:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_MOODLE_BASE_URL`

Tambem copie as integracoes que estiverem ativas:

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`
- Moodle: `MOODLE_WS_TOKEN`, `MOODLE_WS_BASE_URL`, `MOODLE_COURSE_MAP`, `MOODLE_ACCESS_*`
- PagBank: `PAGBANK_*`, `MOODLE_CHECKOUT_ALLOW_GENERIC_FALLBACK`
- Videos/CDN: `NEXT_PUBLIC_CAMPUS_CDN_BASE_URL`, `NEXT_PUBLIC_*MUX*`, `NEXT_PUBLIC_*BUNNY*`, `BUNNY_STREAM_*`
- TTS: `ELEVENLABS_*`, `TTS_*`
- Observabilidade: `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`

Depois de apontar o dominio final, use o dominio canonico em:

- `NEXTAUTH_URL=https://seu-dominio`
- `NEXT_PUBLIC_SITE_URL=https://seu-dominio`

## Banco e Prisma

O build executa `prisma generate`, mas nao executa migracoes automaticamente.
Antes de liberar o dominio em producao, rode as migracoes no banco de producao:

```bash
npm run db:migrate:deploy
```

Use `DATABASE_URL` e `DIRECT_URL` apontando para o banco de producao nessa execucao.

## Validacao apos deploy

1. Abra `/status` e confirme:
   - Sistema online
   - Login com `NEXTAUTH_SECRET` disponivel
   - Ambiente Netlify exibido em `Ambiente`
2. Abra `/campus` e teste login, painel de curso e uma chamada tRPC.
3. Abra `/api/campus/audio-tracks` e confirme que retorna `tracks` com URLs `/audio/...`.
4. Teste um arquivo rastreado, por exemplo `/audio/campus-ambient.wav`.
5. Se usar checkout, teste `/planos` e o webhook PagBank em ambiente controlado.
6. Se usar Moodle, valide a abertura de cursos e sincronizacao de acesso.

## Audio do campus

Os arquivos rastreados em `public/audio/mp3/` e `public/audio/campus-ambient.wav`
entram no deploy Netlify e alimentam o player ambiente do campus.

Os audios de aulas gerados em `public/audio/lessons/` ou `public/audio/<course>/`
podem ser grandes e continuam recomendados para Supabase Storage/CDN, com URLs
registradas na tabela `LessonAudio`.

## DNS

Quando o deploy preview estiver validado, aponte o dominio no painel da Netlify.
So depois ajuste `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL` para o dominio final e redeploy.
