import type { Area } from "@/data/courses";
import { getOutlineForArea } from "@/data/courseOutlines";

const templates = (area: Area) => [
  `Introdução à ${area.name}`,
  area.highlights[0] ?? "Tema fundador",
  area.highlights[1] ?? "Aplicação prática",
  area.highlights[2] ?? "Aprofundamento",
  "Estudos de caso e exemplos reais",
  "Discussão e projeto",
  "Consolidação · certificação"
];

export function getLessonTitlesForArea(area: Area): string[] {
  const outline = getOutlineForArea(area.id);
  if (outline?.length) return [...outline];
  const t = templates(area);
  return Array.from({ length: area.lessons }, (_, i) => t[i] ?? `Aula ${i + 1}`);
}
