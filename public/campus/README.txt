COLOQUE A IMAGEM AÉREA DO CAMPUS AQUI
======================================

Salve a imagem cinematográfica do campus (a vista aérea noturna que você
mandou no chat) com o nome:

    aerial.webp

Caminho final:  public/campus/aerial.webp

Formatos aceitos: .webp (recomendado), .png, .jpg

A página /campus carrega esse arquivo automaticamente. Se não existir,
um fundo provisório com luzes ambientais aparece no lugar (e os hotspots
continuam funcionando).

Dicas de qualidade:
- Resolução mínima: 1920x1280
- Recomendado: 2560x1707 ou 3072x2048
- Formato webp economiza ~60% de banda vs png

Se quiser servir a versão @2x para retina, salve também:
    aerial@2x.webp
(o componente CampusMap pode ser ajustado depois pra usar srcset)

Cine THC — telão opcional no mapa
---------------------------------

Arte opcional do telão pulsante (quando há live):

1. Copie uma imagem (ex.: PNG) para `public/campus/cine-tela.png` ou outro caminho público.

2. No `.env` / `.env.local`, defina o URL público (vazio por defeito = sem pedido de imagem, só gradiente e ícone — evita 404):

       NEXT_PUBLIC_CAMPUS_CINE_TELA=/campus/cine-tela.png

Variáveis de ambiente públicas (.env.local):

    NEXT_PUBLIC_CAMPUS_LIVE_ACTIVE=true|false
    NEXT_PUBLIC_CAMPUS_LIVE_YOUTUBE_URL=https://www.youtube.com/watch?v=...
