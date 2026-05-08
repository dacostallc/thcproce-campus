import type { CourseLessonTheme } from "@/data/courseLessonThemes";
import { CANNABIS101_AREA_ID } from "./manifest";

const mesh = (from: string, via: string, to: string) =>
  `bg-gradient-to-br ${from} ${via} ${to}`;

/**
 * Identidade / mood / classes do hero (sem alterar componentes — fonte canónica para este curso).
 */
export const CANNABIS101_COURSE_THEME: CourseLessonTheme = {
  areaId: CANNABIS101_AREA_ID,
  tagline: "Curso base · trilha completa THCProce · sala oficial quando precisar de arquivo formal",
  mood:
    "29 capítulos no ritmo Netflix + método de laboratório. Aqui você vive pacing, framing e perguntas de estúdio o tempo inteiro — o dossier institucional (PDF, provas, certificado com validade de escola) continua por trás da mesma sala oficial THCProce até a fusão técnica em tempo real ser ligada ao campus.",
  heroClass: mesh("from-slate-950", "via-indigo-950/95", "to-emerald-950"),
  orbClass: "from-cyan-400/25 to-transparent"
};
