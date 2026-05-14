# Como adicionar um novo curso com o layout Blueprint (Cannabis 101)

O layout Blueprint inclui: **Sidebar agrupada por categoria**, **HUD de XP e Progresso**, **botão "Concluir Aula"** e **Player de narração ElevenLabs**.

---

## Checklist completo (6 passos)

### Passo 1 — Criar a pasta do curso

```bash
cp -r src/content/courses/_template-curso src/content/courses/meu-curso
```

Renomeie `meu-curso` pelo slug do seu curso (ex: `extracoes-101`, `cultivo-avancado`).

---

### Passo 2 — Preencher o manifest

Edite `src/content/courses/meu-curso/manifest.ts`:

```ts
export const MEU_CURSO_MANIFEST: CourseManifest = {
  areaId: "extracoes-101",           // ← slug único
  displayName: "Extrações 101",
  hud: { nextLessonFallbackLabel: "Extrações 101 · Introdução" },
  previewLessonTitles: ["Fundamentos · Introdução", "Fundamentos · Equipamentos"],
  stats: { lessonCount: 12, hoursLabel: "≈5h" },
  marketing: { ... }
};
```

---

### Passo 3 — Registrar o curso (ativa o layout Blueprint)

Em `src/content/courses/coursesRegistry.ts`:

```ts
import { MEU_CURSO_MANIFEST } from "./meu-curso/manifest";

// Adicione junto com os outros registerCourse():
registerCourse({
  manifest: MEU_CURSO_MANIFEST,
  usesCinematicLayout: true,    // ← OBRIGATÓRIO para ativar sidebar + HUD + Concluir Aula
});
```

---

### Passo 4 — Adicionar à lista de áreas do campus

Em `src/data/courses.ts`, no array `AREA_FALLBACK_ROWS`:

```ts
{
  id: "meu-curso",                // ← igual ao areaId do manifest
  name: "Extrações 101",
  short: "Descrição curta",
  category: "Extração",
  level: "Intermediário",
  color: "purple",
  position: { x: 60, y: 45 },   // ← posição no mapa visual (%)
  description: "Descrição completa...",
  highlights: ["Ponto 1", "Ponto 2", "Ponto 3"],
  professor: "Professor THCProce",
  lessons: 12,                   // ← deve bater com lessonCount no manifest
  hours: "≈5h"
},
```

---

### Passo 5 — Adicionar os títulos da sidebar

Em `src/data/courseOutlines.ts`, no objeto `COURSE_OUTLINES`:

```ts
"meu-curso": [
  "Fundamentos · Introdução ao tema",
  "Fundamentos · Equipamentos básicos",
  "Fundamentos · Segurança no laboratório",
  "Técnicas · Processo A",
  "Técnicas · Processo B",
  // ... (um título por aula, na mesma ordem do course.json)
],
```

> O formato `"Categoria · Título"` é obrigatório para o agrupamento automático na sidebar.

---

### Passo 6 — Criar os arquivos Markdown das aulas

Copie o template de aula para cada lição:

```bash
# Para cada aula:
cp src/content/courses/_TEMPLATE_AULA.md \
   src/content/courses/meu-curso/mc-l01-introducao.md
```

Edite o frontmatter de cada arquivo:

```markdown
---
title: "Fundamentos · Introdução ao tema"
description: "Descrição breve da aula."
lessonIndex: 0
stableId: "mc-l01-introducao"
---
```

Atualize o `course.json` com os ids:

```json
{
  "courseId": "meu-curso",
  "lessons": [
    "mc-l01-introducao",
    "mc-l02-equipamentos",
    ...
  ]
}
```

---

## O que você ganha automaticamente

| Funcionalidade | Ativado por |
|---|---|
| Sidebar agrupada por categoria | `usesCinematicLayout: true` + títulos com `·` |
| HUD de XP e Progresso | `usesCinematicLayout: true` |
| Botão "Concluir Aula" + XP | Automático (lessonMarkSeen) |
| Skeleton de carregamento | Automático |
| Cache de 5 min (React Query) | Automático |
| Sync localStorage → DB no login | Automático |
| Player de narração ElevenLabs | Automático (gerar áudio: `npx tsx scripts/generate-lesson-audio.mts meu-curso all`) |
| Progresso em `UserCourseProgress` | Automático |

---

## Gerar narração em áudio

Após ter `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` no `.env`:

```bash
# Gera o áudio de todas as aulas do curso:
npx tsx scripts/generate-lesson-audio.mts meu-curso all

# Ou de uma aula específica:
npx tsx scripts/generate-lesson-audio.mts meu-curso mc-l01-introducao
```

---

## Exemplo completo: "Extrações 101"

```
src/content/courses/extracoes-101/
  manifest.ts          ← CourseManifest com areaId: "extracoes-101"
  course.json          ← { "lessons": ["ext-l01-...", ...] }
  ext-l01-introducao.md
  ext-l02-equipamentos.md
  ...
```

`coursesRegistry.ts`:
```ts
registerCourse({ manifest: EXTRACOES_101_MANIFEST, usesCinematicLayout: true });
```

`courseOutlines.ts`:
```ts
"extracoes-101": [
  "Fundamentos · Introdução às extrações",
  "Fundamentos · Equipamentos e segurança",
  ...
]
```

`courses.ts`:
```ts
{ id: "extracoes-101", lessons: 8, ... }
```

**Pronto.** O aluno abre a sala no campus e já vê sidebar, HUD, Concluir Aula e player — idêntico ao Cannabis 101.
