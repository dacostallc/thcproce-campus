import { CANNABIS101_MODULES } from "./manifest";

const MODULE_TAGLINES: Record<string, string> = {
  fundamentos: "Primeiros passos: o que é a planta, o nome correto e os contextos em que ela aparece na sociedade.",
  "quimica-sensorial":
    "O que há dentro da flor além do cheiro bonito — canabinoides e terpenos, sem promessas milagrosas.",
  "corpo-e-uso":
    "Como o corpo encontra a cannabis, que conversas existem sobre uso terapêutico, adulto e segurança.",
  "legal-e-seguranca":
    "Panorama legal de alto nível e um acordo claro sobre o que este curso pode (e não pode) fazer por si.",
  encerramento: "De onde sair daqui com rumo: cultivo, extração e medicina canabinoide no campus."
};

export type Cannabis101StreamChapter = {
  moduleId: string;
  moduleTitle: string;
  moduleOrdinal: number;
  moduleCount: number;
  lessonOrdinalInModule: number;
  lessonsInModule: number;
  globalLesson: number;
  globalTotal: number;
  tagline: string;
};

/** Contexto de “capítulo” para UI cinematográfica (Cannabis 101 apenas). */
export function getCannabis101StreamChapter(lessonIndex: number): Cannabis101StreamChapter | null {
  const globalTotal = CANNABIS101_MODULES.reduce((n, m) => n + m.lessons.length, 0);
  if (lessonIndex < 0 || lessonIndex >= globalTotal) return null;
  let offset = 0;
  for (let mi = 0; mi < CANNABIS101_MODULES.length; mi++) {
    const mod = CANNABIS101_MODULES[mi]!;
    const len = mod.lessons.length;
    if (lessonIndex < offset + len) {
      const li = lessonIndex - offset;
      return {
        moduleId: mod.id,
        moduleTitle: mod.title,
        moduleOrdinal: mi + 1,
        moduleCount: CANNABIS101_MODULES.length,
        lessonOrdinalInModule: li + 1,
        lessonsInModule: len,
        globalLesson: lessonIndex + 1,
        globalTotal,
        tagline: MODULE_TAGLINES[mod.id] ?? "Mais um capítulo na sua formação THCProce."
      };
    }
    offset += len;
  }
  return null;
}
