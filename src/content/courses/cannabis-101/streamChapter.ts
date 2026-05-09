import { CANNABIS101_MODULES } from "./manifest";

const MODULE_TAGLINES: Record<string, string> = {
  intro:
    "Primeiro capítulo: por que esse curso existe, como a galera estuda na THCProce, e o clima da jornada que te espera.",
  live: "Ao vivo, calendário e aquele feeling de estar na mesma energia que o resto da comunidade.",
  "cultivo-intro":
    "Da semente à folha — biologia com pé no chão, pra você chegar na bancada com confiança (e sem glossário chato).",
  variedades:
    "Indica, sativa, híbridas e o que o rótulo realmente quer dizer — genética, morfologia e zero lorota de marketing.",
  preparativos:
    "Antes de plantar de verdade: montar o cantinho, luz, ar e solo como quem prepara estúdio — com carinho e segurança.",
  processo:
    "Do broto à floração: germinação, dossel, flora — o ritmo completo do ciclo, como numa seasonal de jogo só que real.",
  manutencao:
    "O dia a dia na bancada: rega que não erra o pulso, planta falando com você, e dossel redondo sem drama.",
  "pos-colheita":
    "Corte, secagem, cura — onde o capricho vira resultado de verdade (sem atropelar o tempo do processo).",
  avaliacao: "Boss fight educativo: revisitando o que você aprendeu em toda a trilha — com consciência e método.",
  consideracoes:
    "Fechar essa season com cabeça erguida: próximos passos, comunidade, e sede de continuar aprendendo.",
  certificado:
    "Camisa de time: requisitos, papelada que importa, e o que vem depois que você cruzar a linha de chegada."
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
        tagline: MODULE_TAGLINES[mod.id] ?? "Mais um capítulo na sua trilha THCProce."
      };
    }
    offset += len;
  }
  return null;
}
