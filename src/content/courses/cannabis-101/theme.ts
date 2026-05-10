import type { CourseLessonTheme } from "@/data/courseLessonThemes";
import { CANNABIS101_AREA_ID } from "./manifest";

const mesh = (from: string, via: string, to: string) =>
  `bg-gradient-to-br ${from} ${via} ${to}`;

/**
 * Identidade / mood / classes do hero (sem alterar componentes — fonte canônica para este curso).
 */
export const CANNABIS101_COURSE_THEME: CourseLessonTheme = {
  areaId: CANNABIS101_AREA_ID,
  tagline: "Curso base · linguagem clara · responsabilidade · sala oficial quando precisar de arquivo formal",
  mood:
    "Onze aulas para organizar conceitos, respeitar o corpo e entender o quadro legal sem juridiquês pesado. O campus mantém o ritmo cinematográfico da experiência; provas formais, PDFs longos e certificação continuam na sala digital THCProce quando a escola os publicar.",
  heroClass: mesh("from-slate-950", "via-indigo-950/95", "to-emerald-950"),
  orbClass: "from-cyan-400/25 to-transparent"
};
