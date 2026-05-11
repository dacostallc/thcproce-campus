# Authoring — pacotes pedagógicos dos map-points do campus



Cada hotspot com texto em `src/content/campus/map-points/<slug>/` pode ter um **pacote opcional** de ficheiros JSON ao lado de `overview.md`. O leitor do mapa (`loadCampusMapPointReaderPayload`) junta estes dados ao payload tRPC sem alterar rotas nem stores.



## Layout da pasta



```

src/content/campus/map-points/<slug>/

  overview.md      # obrigatório para o leitor; frontmatter YAML + corpo Markdown

  mission.json       # opcional

  quiz.json          # opcional

  rewards.json       # opcional (XP/coins/raridade gerados pelo sync — ver abaixo)

  ambience.json      # opcional

  metadata.json      # opcional → exposto como `bundleMeta` na API

  seasonal.json      # opcional → cenários editoriais sazonais (sem eventos ao vivo)

```



O `slug` deve ser `[a-z0-9-]{1,120}` (alinhado com ids dos hotspots interativos).



**Alias de pasta:** o hotspot `campus-cinema` lê conteúdo em `map-points/campus-live-cinema/` (ver `resolveCampusMapPointContentFolderSlug`). Mantém-se o id do mapa; só a pasta editorial difere.



## Fonte editorial principal (`scripts/`)



- **`campus-map-point-bundles-data.mjs`** — texto das micro-aulas (`lesson(...)`), missões, quiz, ambience e **badge** em `rewards`.

- **`campus-map-point-progression.mjs`** — tier por slug (`campus` | `info` | `pratica` | `tecnica` | `mestre`), **cadeias de aprendizado** (`journeyBySlug`) e **cenários sazonais** (`seasonalBySlug`). Mantém faixas numéricas alinhadas a `src/lib/campus/campusMapPointRewardTiers.ts`.

- **`campus-map-point-decks.mjs`** — uma linha “deck” sensorial por slug (abertura viva antes da primeira secção).

- **`sync-campus-map-point-bundles.mjs`** — regenera `overview.md` (preserva frontmatter), JSON na pasta e faz merge de XP/Green Coins/Grower Master/`rarity` + metadata da jornada + `seasonal.json`.



Comandos (raiz do repo):



- `npm run content:apply-decks` — garante `deck` em cada `lesson()` no data script (idempotente).

- `npm run content:map-bundles` — sync completo para `src/content/campus/map-points/*/`.



## `overview.md`



- **Frontmatter:** manter chaves existentes (`mapPointId`, `title`, `panelTitle`, `linkedCourseId`, …). Ao atualizar o corpo, não apagar chaves; apenas fundir valores quando fizer sentido.

- **Corpo (modelo `lesson`):** secções com títulos customizáveis em pt-BR (predefinições: história de quem cultiva, prática, olhar de cultivador, erros de roça, filosofia calma, missão, conclusão). Inclui bloco opcional **deck** (gancho sensorial) e aviso legal em blockquote.

- Tom: mentor experiente falando com gente do dia a dia — concreto, THCProce, observação e segurança; evitar voz de blog ou frases genéricas de “curso gravado”.



## `mission.json`



```json

{

  "title": "string",

  "description": "string",

  "checklist": ["string", "..."]

}

```



Checklist com 3–6 itens acionáveis.



## `quiz.json`



Exatamente **duas** questões; cada uma com **quatro** opções e `correctIndex` entre `0` e `3`. As perguntas testam decisão prática.



## `rewards.json` (saída do sync)



O sync define números e raridade a partir do tier em `campus-map-point-progression.mjs` (espelho TS em `campusMapPointRewardTiers.ts`):



| Tier (`progressionTierBySlug`) | Raridade   | XP | Green Coins | Grower Master |

|--------------------------------|------------|-----|-------------|---------------|

| `campus`                       | comum      | 5   | 2           | 1             |

| `info`                         | comum      | 5   | 3           | 1             |

| `pratica`                      | raro       | 15  | 5           | 2             |

| `tecnica`                      | épico      | 30  | 8           | 3             |

| `mestre`                       | lendário   | 45  | 12          | 4             |



No **data script**, mantém apenas o objeto **`badge`** dentro de `rewards`; o sync acrescenta `xp`, `greenCoins`, `growerMasterProgress` e `rarity`.



Valores continuam **referência pedagógica** na UI até existir persistência real.



## `ambience.json`



```json

{ "lines": ["Frase curta 1", "Frase curta 2"] }

```



## `metadata.json`



Além de tema/tags/dificuldade/categoria/`areaType`, pode incluir **progressão sugerida** (sem navegação automática):



```json

{

  "theme": "…",

  "tags": ["…"],

  "difficulty": "…",

  "category": "…",

  "areaType": "…",

  "prerequisites": ["slug-relacionado"],

  "relatedAreas": ["slug-relacionado"],

  "recommendedNext": ["slug-relacionado"]

}

```



Estes campos são preenchidos pelo sync a partir de `journeyBySlug` em `campus-map-point-progression.mjs`. Slugs são sempre pastas sob `map-points/`.



## `seasonal.json`



Estrutura modular para **futuras** campanhas (calor, chuva, seca, pragas de verão, etc.). **Não** dispara eventos nem websocket.



```json

{

  "scenarios": [

    {

      "id": "calor-extremo",

      "label": "Calor extremo",

      "summary": "Notas pedagógicas para quando revisar ventilação…",

      "relatedSlugs": ["curso-cultivo-greenhouse"]

    }

  ]

}

```



Gerado pelo sync quando há entrada em `seasonalBySlug`.



## Persistência futura (tipos apenas)



Contratos estáveis para evolução sem quebrar o pacote atual: `src/lib/campus/campusMapPointProgressFuture.types.ts` (`CampusMapPointLearnerProgressDraft`, snapshot de quiz/missão/badge/inventário hooks). Sem API nem BD nesta fase.



## Validação



- `readCampusMapPointBundleSlice` valida JSON defensivamente; formato incorreto omite o campo.

- Após editar data/progression: `npm run content:map-bundles`, depois `npm run typecheck` e `npm run build` quando fizer sentido.



## Checklist de gamificação (conteúdo)



- [ ] Missão alinhada ao texto do overview.

- [ ] Quiz com distratores plausíveis.

- [ ] Badge único e coerente (tier numérico centralizado no progression).

- [ ] Ambiente com frases curtas.

- [ ] Jornada (`prerequisites` / `related` / `recommendedNext`) revisada no progression.

- [ ] Cenários sazonais quando o tema pedir ganchos climáticos.


