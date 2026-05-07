import type { Area } from "@/data/courses";
import { getCannabis101LessonRichContent } from "@/data/cannabis101LessonRich";
import type { LessonRichContent } from "./lessonRichTypes";

export type { LessonRichContent } from "./lessonRichTypes";

/**
 * Conteúdo textual por aula — gerado a partir do curso + índice (sem Moodle).
 * Substitui ou enriquece quando houver integração com LMS.
 */
export function getLessonRichContent(
  area: Area,
  lessonIndex: number,
  lessonTitle: string
): LessonRichContent {
  if (area.id === "cannabis-101") {
    return getCannabis101LessonRichContent(lessonIndex, lessonTitle);
  }

  const hi = area.highlights;
  const h = (i: number) => hi[i] ?? null;
  const n = lessonIndex + 1;

  const intro = `Bem-vindo à aula ${n} de ${area.name}. ${area.description.slice(0, 220)}${area.description.length > 220 ? "…" : ""}`;

  const summary = `Nesta sessão trabalhamos «${lessonTitle}» no contexto de ${area.short.toLowerCase()}. O foco é aplicação prática alinhada ao programa THCProce e às melhores práticas da área.`;

  const objectives = [
    `Compreender os fundamentos de «${lessonTitle}» dentro de ${area.name}.`,
    h(0) ? `Relacionar o tema com: ${h(0)}.` : `Conectar teoria e prática do módulo atual.`,
    h(1) ? `Preparar base para: ${h(1)}.` : `Avançar com segurança para as próximas aulas do curso.`
  ];

  const materials = [
    "Apostila e PDFs na sala Moodle (quando publicados pelo corpo docente)",
    "Caderno de anotações — use o bloco “Notas do aluno” abaixo",
    "Lista de verificação enviada ao final do roteiro da aula"
  ];

  const references = [
    "Escola THCProce — materiais oficiais em thcproce.com.br/escola",
    "Bibliografia recomendada pelo professor em cada módulo (Moodle)",
    "Normas e boas práticas citadas em aula (compliance e segurança)"
  ];

  const professorNotes = `Observações do professor (${area.professor}): use esta aula como peça da trilha completa. Dúvidas: canal oficial da escola e fórum Moodle. O campus reflete o seu progresso — marque a aula como vista para somar XP e níveis.`;

  return {
    intro,
    summary,
    objectives,
    materials,
    references,
    professorNotes
  };
}
