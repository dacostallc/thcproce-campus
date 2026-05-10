# Campus — QA visual & fluxos (aluno)

Usar antes de libertar UX do campus THCProce. Marcar quando validado neste navegador / dispositivo.

## Autenticação e entrada

- [ ] Login (`/login`) ou inscrição a partir do HUD
- [ ] Primeira visita ao mapa (`/campus`): modal «Bem-vindo ao Campus THCProce» com três pontos e CTAs Começar tour / Pular
- [ ] Modal de boas-vindas não regressa depois de visto (`localStorage` correspondente)

## Mapa

- [ ] HUD visível por cima do mapa; botões clicáveis
- [ ] Mudança dia/noite
- [ ] Abrir sala de um curso a partir da área clicável ou fluxo Cannabis 101
- [ ] Cartão «Comece aqui» (após boas-vindas): prioritário Cannabis 101 → primeira aula → missões → avatar; chip colapsável no telemóvel

## Tour guiado

- [ ] Inicia a partir do modal ou do chip ou do botão HUD «Tour do Campus»
- [ ] Passos aparecem com destaque nas zonas esperadas + cartão PT legível em ecrã pequeno
- [ ] «Pular tour» e «Encerrar» dispensam tour sem regressão repetida irritante (`thc_campus_guided_tour_done_v1` + legado conforme código)
- [ ] «Concluir tour» no último passo atribui XP/badge local uma única vez (comportamento idempotente)

## Perfil

- [ ] Abrir modal «Meu Perfil»: cabe dentro do ecrã; scroll interno onde necessário (`max-h`/overflow)
- [ ] Editar nome e guardar
- [ ] Inventário — estado vazio com texto PT e atalho loja quando aplicável

## Loja

- [ ] Abrir modal Loja a partir do HUD
- [ ] Comprar item com créditos suficientes; saldo desce na UI
- [ ] Equipar / desequipar item válido pelo inventário

## Aulas e recompensas

- [ ] Abrir aula desde o mapa ou painel
- [ ] Marcar episódio / progresso conforme UX existente; XP ou créditos locais aparecem (toast onde existir)

## Missões

- [ ] Painel HUD «Missões» abre; scroll não corta texto em altura útil em mobile
- [ ] Resgate de uma missão quando concluída atualiza XP, créditos e inventário conforme esperado

## Presença viva / feed

- [ ] Feed lateral (desktop) ou equivalente atualiza texto em PT sem erros óbvios
- [ ] Presence / contadores onde aplicável continuam aceitáveis

## Ranking e inventário

- [ ] Modal «Ranking»: scroll, texto PT na cabeça, link para página completa funciona
- [ ] Inventário página ou modal agrupa categorias quando há itens

## Responsive

- [ ] Nenhuma modal HUD domina ilegível o viewport em `375×667` típico; margens e `overflow-y-auto` comportam-se bem

## Reset local (equipa QA / modo desenvolvimento apenas)

Activar quando `NODE_ENV=development`, `NEXT_PUBLIC_DEBUG_PROFILE_RESET=true`, ou sessão com e-mail admin do campus (ver `campusAdmin`).

- [ ] No rodapé de «Meu perfil», aparece o botão discreto «Resetar progresso local»
- [ ] Ao confirmar, repõe bem-vindo, tour, marcações de aulas, XP/créditos/inventário local, snapshot de progresso campus, streak local do HUD e chave «Comece aqui» nesta sessão → sugerido recarregar a página logo após o reset
