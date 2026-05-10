# Autoria de áreas polygon no mapa do campus

Este fluxo usa **`src/lib/campusMapAreasCatalog.ts`**: só estrutura de dados + render opcional para QA.  
**Não** há deteção automática de zonas nem alteração aos ficheiros em `public/campus/` — apenas coordenadas que a equipa cola/manualiza.

## Sistema de coordenadas recomendado

- **`coordUnit`: `"percent_of_stage"`** — cada vértice é uma percentagem **[0–100]** do retângulo do palco onde a imagem do mapa é desenhada com `object-fit: cover`.
- **`coordUnit`: `"pixel_ref_1920_1080"`** — vértices em pixels relativos à referência da arte (**não ao mapa inteiro sem crop**); o código apenas aplica \(\times 100 / 1920\) e \(\times 100 / 1080\) via `campusMapNormalizePolygonToPercent` (sem analisar a imagem).
- Os polígonos são desenhados num SVG com **`viewBox="0 0 100 100"`** e **`preserveAspectRatio="none"`**, alinhado ao mesmo palco que o `/campus`.

## Formato JSON (v1)

Graça a copiar ou gravar em `localStorage`:

```json
{
  "version": 1,
  "areas": [
    {
      "id": "sal_mezcla",
      "label": "Sala exemplo",
      "coordUnit": "percent_of_stage",
      "polygon": [
        { "x": 42.5, "y": 30 },
        { "x": 55, "y": 30 },
        { "x": 52, "y": 48 }
      ]
    }
  ]
}
```

Regras de validação no parser:

- `version` obrigatório e igual a **`1`**.
- `areas`: array com pelo menos **3** pontos por polígono.
- `id` não vazio; `polygon` apenas números finitos.

## Ferramentas tipo “image map generator”

Ferramentas online exportam coordenadas em **pixels relativos ao ficheiro** (natural width × height):

1. Anote a largura \(W\) e altura \(H\) da imagem **que está efectivamente sobre o canvas** onde desenhou o polígono (se for a PNG 1920×1080, use esses valores).
2. Para cada par \((px, py)\) exportados, converta **manualmente**:

   $$\text{pct}_x = 100 \times px / W \qquad \text{pct}_y = 100 \times py / H$$

3. Ou use no catálogo `coordUnit: "pixel_ref_1920_1080"` com os pixels brutos se a referência for exactamente **1920×1080**.

**Importante:** se a imagem no site aparece cortada (`object-fit: cover`), pontos tirados só do bitmap completo podem falhar relativamente ao crop visível — ajustar no preview até coincidirem visualmente (`/preview/campus-map-areas`).

## Onde pré-visualizar e testar em `/campus`

1. Página **`/preview/campus-map-areas`** — cola JSON, vê sob a mesma arte `public/campus/campus.png`, sem sair da ferramenta.
2. **Gravar overlay no navegador** na preview grava **`localStorage`** chave:

   ```
   thc_campus_map_areas_overlay_json_v1
   ```

3. Na rota **`/campus`**, montar o overlay requer desenvolvimento **ou**:

   ```
   NEXT_PUBLIC_CAMPUS_MAP_AREAS_DEBUG=true
   ```

   Isto apenas desenha o SVG (`CampusMapAreasDebugOverlay`): **não** liga clicks nem muda hotspots existentes.

## Catálogo de produção

- **`CAMPUS_MAP_AREAS_CATALOG`** — lista vazia até alguém mover áreas revisadas aqui por PR.
- **`CAMPUS_MAP_AREAS_EXAMPLE_ONLY`** — dois polígonos triviais marcados **`exampleOnly`**; servem apenas para exemplo de código e regressão visual do overlay — **substituir** quando houver shapes reais.

## Passo seguinte esperado pela equipa

Quando uma área estiver validada, copiar como entrada `{ id, label?, coordUnit, polygon }` para `CAMPUS_MAP_AREAS_CATALOG` num PR (removendo ou mantendo conforme política futura um eventual `courseId` quando se ligar aos cursos).
