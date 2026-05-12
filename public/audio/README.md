# Áudio do campus (produção)

Coloca ficheiros estáticos em `public/audio/` para serem servidos em `https://<domínio>/audio/...` (sem depender de localhost).

## Pastas

- `public/audio/ambience/` — sons ambiente
- `public/audio/radio/` — “rádio”
- `public/audio/cinema/` — trilhas “cinema”
- `public/audio/mp3/` — legado (ainda listado pela API como categoria `legacy`)

Também são listados **ficheiros colocados directamente em `public/audio/`** (raiz), tratados como ambiente no HUD.

Formatos suportados pelo scanner: `.mp3`, `.wav`, `.ogg`, `.m4a`, `.opus`, `.flac` (suporte de reprodução depende do navegador).

## Deploy

1. Copia os MP3/WAV para as pastas acima no artefacto de build (ou mantém no repositório se o tamanho for aceitável).
2. Garante que o CDN/host não bloqueia `Range`/`HEAD` para estes ficheiros (o cliente faz validação leve antes de listar).

O leitor HUD usa `GET /api/campus/audio-tracks`, que lista estes ficheiros em tempo de pedido.
