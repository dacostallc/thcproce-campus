# content/courses — Aulas em Markdown

Cada subpasta aqui é um curso. O campus lê os arquivos `.md` automaticamente, sem alterar código.

## Estrutura por curso

```
content/courses/
├── cannabis-101/           ← curso existente
│   ├── course.json         ← manifest do curso (obrigatório)
│   └── lessons/
│       ├── c101-l01-boas-vindas.md
│       └── ...
│
├── extracoes-101/          ← novo curso (exemplo)
│   ├── course.json
│   └── lessons/
│       └── ext-l01-introducao.md
│
└── _template/              ← ponto de partida para novos cursos
    ├── course.json
    └── lessons/
        └── lesson-template.md
```

## Como adicionar um novo curso

### 1. Crie a pasta e o manifest

```bash
mkdir -p content/courses/meu-curso/lessons
```

`content/courses/meu-curso/course.json`:
```json
{
  "courseId": "meu-curso",
  "title": "Meu Curso – Título Completo",
  "lessons": [
    "mc-l01-introducao",
    "mc-l02-segundo-tema"
  ]
}
```

> O campo `lessons` define a **ordem das aulas** no campus.  
> Posição 0 = Aula 1, posição 1 = Aula 2, etc.

### 2. Crie os arquivos de aula

Copie `_template/lessons/lesson-template.md` para cada aula:

```bash
cp content/courses/_template/lessons/lesson-template.md \
   content/courses/meu-curso/lessons/mc-l01-introducao.md
```

Edite o frontmatter de cada arquivo:

```markdown
---
title: "Categoria · Título da aula"
description: "Descrição breve."
lessonIndex: 0
stableId: "mc-l01-introducao"
---
```

### 3. Registre a área no campus

Em `src/data/courses.ts`, adicione a nova área com o `id` igual ao `courseId`:

```ts
{
  id: "meu-curso",        // deve ser igual ao courseId no course.json
  name: "Meu Curso",
  // ...demais campos
}
```

### 4. Pronto — sem mais alterações de código

O campus detecta automaticamente:
- `LessonPanel` habilita o leitor estático para qualquer área sem blocos no DB
- `staticLessonMarkdown` (tRPC) lê `course.json` → resolve índice → lê o `.md`
- `LessonStaticReadingShell` renderiza o Markdown com skeleton e cache de 5 min

## Regras de nomenclatura

| Campo | Padrão | Exemplo |
|---|---|---|
| `courseId` / nome da pasta | lowercase com hífens | `extracoes-101` |
| `lessonId` / nome do `.md` | lowercase com hífens | `ext-l01-introducao` |
| Frontmatter `stableId` | igual ao nome do arquivo | `ext-l01-introducao` |

Apenas letras minúsculas `a-z`, números `0-9` e hífens são aceitos.  
Barras, pontos e maiúsculas causam erro 404 no loader.

## Cache e performance

- O `course.json` de cada curso é lido uma vez e mantido em memória durante a vida do processo.
- O Markdown de cada aula não é cacheado no servidor — o React Query cuida do cache no cliente (staleTime: 5 min por padrão).
- Em produção (Vercel serverless), o cache reseta a cada cold-start — comportamento esperado.
