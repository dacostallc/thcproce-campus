import type { LessonQuizItem } from "@/data/lessonContent/types";
import type { LessonRichContent } from "@/data/lessonRichTypes";

export type ClassroomTextSlide = {
  id: string;
  kind: "text";
  title: string;
  body: string;
};

export type ClassroomQuizSlide = {
  id: string;
  kind: "quiz";
  title: string;
  question: LessonQuizItem;
  /** Índice global no array original do conteúdo (para chaves estáveis de quiz). */
  questionIndex: number;
};

export type ClassroomSlide = ClassroomTextSlide | ClassroomQuizSlide;

/** Tamanho-alvo por tela (caracteres) — só subdivide trechos maiores; nunca altera o texto. */
const READING_CHUNK_SOFT_MAX = 880;

function splitBodyParagraphs(body: string | undefined): string[] {
  if (!body?.trim()) return [];
  return body
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Separadores frequentes em exportações tipo Markdown (linha só com traços).
 * Mantém o texto de cada lado intacto; só parte a string.
 */
function splitByHorizontalRules(text: string): string[] {
  const parts = text.split(/\n-{3,}\n/).map((s) => s.trim());
  if (parts.length <= 1) return [text.trim()].filter(Boolean);
  return parts.filter(Boolean);
}

/**
 * Parte um trecho longo em segmentos por frases / linhas, sem reescrever.
 */
function chunkLongPlainText(text: string, softMax: number): string[] {
  const t = text.trim();
  if (!t) return [];
  if (t.length <= softMax) return [t];

  const lines = t.split("\n");
  const out: string[] = [];
  let acc = "";

  const flushAcc = () => {
    const s = acc.trim();
    if (s) out.push(s);
    acc = "";
  };

  for (const line of lines) {
    const lineTrim = line.trimEnd();
    const candidate = acc ? `${acc}\n${lineTrim}` : lineTrim;
    if (candidate.length <= softMax) {
      acc = candidate;
      continue;
    }
    flushAcc();
    if (lineTrim.length <= softMax) {
      acc = lineTrim;
    } else {
      out.push(...chunkBySentence(lineTrim, softMax));
    }
  }
  flushAcc();
  return out.length ? out : [t];
}

function chunkBySentence(text: string, softMax: number): string[] {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const chunks: string[] = [];
  let cur = "";
  for (const p of parts) {
    const next = cur ? `${cur} ${p}` : p;
    if (next.length <= softMax) {
      cur = next;
      continue;
    }
    if (cur) chunks.push(cur.trim());
    if (p.length <= softMax) cur = p;
    else {
      chunks.push(...hardWordWrap(p, softMax));
      cur = "";
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks.length ? chunks : [text];
}

function hardWordWrap(text: string, maxLen: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxLen) cur = next;
    else {
      if (cur) lines.push(cur);
      cur = w.length > maxLen ? w.slice(0, maxLen) : w;
      while (cur.length >= maxLen) {
        lines.push(cur.slice(0, maxLen));
        cur = cur.slice(maxLen);
      }
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function expandLogicalParagraphs(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  const withRules = splitByHorizontalRules(raw);
  const paras: string[] = [];
  for (const segment of withRules) {
    paras.push(...splitBodyParagraphs(segment));
  }
  return paras;
}

function pushTextChunks(
  slides: ClassroomSlide[],
  idCounter: { n: number },
  baseTitle: string,
  body: string
) {
  const paras = expandLogicalParagraphs(body);
  if (!paras.length) return;

  paras.forEach((p, pi) => {
    const chunks = chunkLongPlainText(p, READING_CHUNK_SOFT_MAX);
    const pLabel =
      paras.length > 1 ? `${baseTitle} · secção ${pi + 1}` : baseTitle;
    chunks.forEach((chunk, ci) => {
      const title =
        chunks.length > 1 ? `${pLabel} · parte ${ci + 1}/${chunks.length}` : pLabel;
      slides.push({ id: `t-${idCounter.n++}`, kind: "text", title, body: chunk });
    });
  });
}

/**
 * Monta telas de leitura a partir do `LessonRichContent` — apenas divisões de string;
 * nunca altera palavras (corte em limites naturais / export).
 */
export function buildClassroomSlidesFromRichContent(
  content: LessonRichContent,
  opts?: { skipIntro?: boolean }
): ClassroomSlide[] {
  const slides: ClassroomSlide[] = [];
  const idCounter = { n: 0 };

  if (!opts?.skipIntro) {
    pushTextChunks(slides, idCounter, "Abertura", content.intro);
  }

  const bodyParas = expandLogicalParagraphs(content.body);
  bodyParas.forEach((p, pi) => {
    const chunks = chunkLongPlainText(p, READING_CHUNK_SOFT_MAX);
    const pLabel =
      bodyParas.length > 1 ? `Conteúdo · secção ${pi + 1}` : "Conteúdo";
    chunks.forEach((chunk, ci) => {
      const title =
        chunks.length > 1 ? `${pLabel} · parte ${ci + 1}/${chunks.length}` : pLabel;
      slides.push({ id: `t-${idCounter.n++}`, kind: "text", title, body: chunk });
    });
  });

  const obj = content.objectives.filter((o) => o.trim());
  obj.forEach((o, i) => {
    pushTextChunks(slides, idCounter, `Objetivo ${i + 1}`, o);
  });

  pushTextChunks(slides, idCounter, "Resumo", content.summary);

  const mats = content.materials.filter((m) => m.trim());
  mats.forEach((m, i) => {
    pushTextChunks(slides, idCounter, `Material · ${i + 1}`, m);
  });

  const refs = content.references.filter((r) => r.trim());
  refs.forEach((r, i) => {
    pushTextChunks(slides, idCounter, `Referência · ${i + 1}`, r);
  });

  pushTextChunks(slides, idCounter, "Notas do professor", content.professorNotes);

  content.quiz?.forEach((q, i) => {
    slides.push({
      id: `q-${idCounter.n++}`,
      kind: "quiz",
      title: `Questão ${i + 1}`,
      question: q,
      questionIndex: i
    });
  });

  return slides;
}
