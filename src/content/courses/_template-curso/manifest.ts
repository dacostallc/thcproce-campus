/**
 * TEMPLATE DE NOVO CURSO — copie esta pasta para `src/content/courses/<slug>/`
 * e edite os valores marcados com ← EDITE.
 *
 * Após preencher:
 *   1. Importe e registre em `src/content/courses/coursesRegistry.ts`
 *   2. Adicione entrada em `src/data/courses.ts` (AREA_FALLBACK_ROWS)
 *   3. Adicione títulos em `src/data/courseOutlines.ts` (COURSE_OUTLINES)
 *   4. Crie os .md em `src/content/courses/<slug>/` (use _TEMPLATE_AULA.md)
 *   5. Atualize `course.json` com os ids das aulas
 */

import type { CourseManifest } from "@/content/courses/types";

export const MEU_CURSO_MANIFEST: CourseManifest = {
  areaId: "meu-curso",                                     // ← EDITE: igual ao id em courses.ts

  displayName: "Nome do Curso",                            // ← EDITE

  hud: {
    nextLessonFallbackLabel: "Nome do Curso · Aula 1",     // ← EDITE: label do HUD quando nenhuma aula foi aberta
  },

  previewLessonTitles: [                                   // ← EDITE: primeiras 3-4 aulas para preview no mapa
    "Categoria · Título da aula 1",
    "Categoria · Título da aula 2",
    "Categoria · Título da aula 3",
  ],

  stats: {
    lessonCount: 10,                                       // ← EDITE: número total de aulas
    hoursLabel: "≈4h leitura guiada",                     // ← EDITE
  },

  marketing: {
    short: "Descrição curta para o card do mapa.",         // ← EDITE
    category: "Cultivo",                                   // ← EDITE: Anfiteatro | Cultivo | Extração | Medicina...
    level: "Iniciante",                                    // ← EDITE: Iniciante | Intermediário | Avançado
    color: "canna",                                        // ← EDITE: amber | canna | purple | cyan | rose
    mapPosition: { x: 50, y: 50 },                        // ← EDITE: posição no mapa (% x e y)
    description: "Descrição longa para a página do curso.", // ← EDITE
    highlights: [                                          // ← EDITE: 3-4 bullets de destaque
      "Ponto forte 1",
      "Ponto forte 2",
      "Ponto forte 3",
    ],
    professor: "Professor THCProce",                       // ← EDITE
  },
};
