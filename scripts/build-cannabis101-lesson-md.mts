/**
 * Gera `content/courses/cannabis-101/lessons/*.md` a partir de `lessonBodies.ts` +
 * `lessons.ts` — diagramação editorial consistente (sem inventar texto novo).
 *
 * Executar: npx --yes tsx scripts/build-cannabis101-lesson-md.mts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lessonBodiesMod from "../src/content/courses/cannabis-101/lessonBodies.ts";
import lessonsMod from "../src/content/courses/cannabis-101/lessons.ts";

type LessonBody = {
  introduction: string;
  body: string;
  objectives: readonly string[];
  closingSummary: string;
  quiz: readonly { question: string }[];
  professorNotes: string;
};

const { CANNABIS101_LESSON_BODIES } = lessonBodiesMod as { CANNABIS101_LESSON_BODIES: Record<string, LessonBody> };
const { CANNABIS101_LESSON_NODES } = lessonsMod as {
  CANNABIS101_LESSON_NODES: readonly { stableId: string; displayTitle: string }[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
/**
 * Destino canónico: `src/content/courses/cannabis-101/` — co-localizado com os
 * TypeScript sources do curso (manifest, lessonBodies, etc.) e incluído no bundle
 * do Vercel via `outputFileTracingIncludes` em `next.config.mjs`.
 *
 * Caminho legado `content/courses/cannabis-101/lessons/` ainda funciona via
 * fallback em `staticLessonLoader.ts`, mas novos builds escrevem aqui.
 */
const outDir = path.join(root, "src", "content", "courses", "cannabis-101");

/**
 * «Para refletir» em pergunta fechada na prosa. O primeiro item do quiz às vezes é só o enunciado
 * de múltipla escolha (termina em «:») — isolado no Markdown fica incompreensível.
 */
const CANNABIS101_REFLECTION_PROMPTS: Record<string, string> = {
  "c101-l03-indica-sativa-ruderalis":
    "Por que a Ruderalis ganha destaque nesta aula quando falamos de autofloração e de adaptação ao cultivo?",
  "c101-l04-hibridos-genotipos":
    "Na linguagem de breeding desta aula, o que «F1» costuma indicar quando dois parentais são cruzados?",
  "c101-l05-escolha-local-cultivo":
    "Qual é a mensagem principal desta aula sobre qual seria o «melhor» método de cultivo — indoor, outdoor ou estufa — à luz da sua própria realidade (clima, lei, espaço e orçamento)?",
  "c101-l06-selecao-sementes":
    "Para que objetivo prático as sementes feminizadas são pensadas nesta aula, em relação a sexagem e uso do espaço de cultivo?",
  "c101-l07-preparacao-solo":
    "Quando o pH do meio sai da faixa adequada, que problema de absorção esta aula descreve — mesmo com nutrientes presentes no substrato?",
  "c101-l08-canhamo-maconha-medicinal":
    "O que «cannabis medicinal» significa neste curso, sobretudo — e o que o texto deixa claro que não inclui (compras informais, automedicação sem acompanhamento etc.)?",
  "c101-l10-terpenos":
    "O que secagem muito quente e rápida costuma fazer aos terpenos leves e à percepção de aroma, segundo esta aula?",
  "c101-l11-sistema-endocanabinoide":
    "Como esta aula descreve o CBD em relação ao THC, em especial quanto à intoxicação psicoativa típica?",
  "c101-l12-usos-e-reducao-de-danos":
    "Por que misturar THC com álcool ou benzodiazepínicos costuma aumentar sedação e risco de trauma — e o que isso muda na sua leitura de redução de danos?",
  "c101-l14-legalidade-br-eua":
    "Qual marco legal brasileiro esta aula apresenta como referência central na legislação sobre cannabis — e por que ainda assim você precisaria confirmar o texto e a interpretação em fonte oficial e assessoria própria?",
  "c101-l15-seguranca-limites":
    "O que o Cannabis 101 se compromete a oferecer, segundo esta aula — e que tipo de promessa (cura, prescrição, crime, substituição de médico ou advogado) fica explicitamente fora desse combinado?",
  "c101-l16-proximas-trilhas":
    "Antes de seguir para conteúdo avançado de extração com solvente industrial, o que esta aula exige em formação e ambiente seguro — em contraste com improvisação doméstica ou tutorial solto na internet?",
  "c101-l17-germinacao-plantio":
    "Segundo o texto desta aula, a que riscos o excesso de água na germinação costuma estar associado (raiz, oxigênio e fungos)?",
};

/** Desce um nível todos os headings ATX (#–######), até no máximo ######. */
function demoteHeadings(md: string): string {
  return md
    .split("\n")
    .map((line) => {
      const m = /^(\s{0,3})(#{1,6})(\s.*)$/.exec(line);
      if (!m) return line;
      const level = m[2]!.length;
      const next = Math.min(level + 1, 6);
      return `${m[1]!}${"#".repeat(next)}${m[3]!}`;
    })
    .join("\n");
}

function descriptionFromClosing(closingSummary: string): string {
  const t = closingSummary.trim().replace(/\s+/g, " ");
  const m = t.match(/^.{25,280}?[.!?](?=\s|$)/);
  if (m) return m[0]!.trim();
  if (t.length <= 240) return t;
  return `${t.slice(0, 237).trim()}…`;
}

/** Normaliza listas (GFM e marcador tipográfico) para hífen. */
function normalizeListMarkers(md: string): string {
  return md
    .replace(/^(\s*)[\u2022\u00B7]\s+/gm, "$1- ")
    .replace(/^(\s*)\*\s+/gm, "$1- ");
}

/** Primeira linha de conteúdo (ignora vazias) já é um heading ATX. */
function blockStartsWithHeading(md: string): boolean {
  for (const line of md.split("\n")) {
    const t = line.trim();
    if (t === "") continue;
    return /^\s{0,3}#{1,6}\s/.test(line);
  }
  return false;
}

/** Evita separadores horizontais duplicados consecutivos. */
function collapseRedundantHrules(md: string): string {
  return md.replace(/(\n---\n)(?:\s*\n?---\n)+/g, "$1");
}

/** Máximo de uma linha em branco entre blocos — leitura mais densa no painel. */
function compactBlankLines(md: string): string {
  return md.replace(/\n{3,}/g, "\n\n");
}

/** Rótulos tipo «OBJETIVO.», «SÍNTESE.» ou títulos «LINHA — subtítulo» viram ### (só texto já existente). */
function labelLooksLikeShout(s: string): boolean {
  return !/[a-záéíóúãõçâêîôû]/.test(s);
}

const LABEL_DOT_BODY =
  /^([A-ZÁÉÍÓÚÃÕÂÊÎÔÛÇ0-9][A-ZÁÉÍÓÚÃÕÂÊÎÔÛÇ0-9 \t,;:()\-\/"]{1,130})\.\s+(\S[\s\S]*)$/u;

function promotePedagogicalLabels(md: string): string {
  const blocks = md.split(/\n\n+/);
  const next: string[] = [];
  for (const block of blocks) {
    const b = block.trim();
    if (!b) {
      next.push(block);
      continue;
    }
    const lines = b.split("\n");
    const firstLine = lines[0] ?? "";
    if (/^\s{0,3}#{1,6}\s/.test(firstLine)) {
      next.push(block);
      continue;
    }
    if (/^\s{0,3}[-*+]\s/.test(firstLine)) {
      next.push(block);
      continue;
    }
    if (/^\s{0,3}>/.test(firstLine)) {
      next.push(block);
      continue;
    }
    if (/^\s{0,3}\d+\.\s/.test(firstLine)) {
      next.push(block);
      continue;
    }
    if (/^Nota institucional:/i.test(b)) {
      next.push(lines.map((ln) => `> ${ln}`.trimEnd()).join("\n"));
      continue;
    }
    if (lines.length === 1) {
      const line = lines[0]!;
      const m = LABEL_DOT_BODY.exec(line);
      if (m) {
        const label = m[1]!;
        const rest = m[2]!;
        if (labelLooksLikeShout(label)) {
          next.push(`### ${label}.\n\n${rest}`);
          continue;
        }
      }
      const mDash =
        /^([A-ZÁÉÍÓÚÃÕÂÊÎÔÛÇ0-9][A-ZÁÉÍÓÚÃÕÂÊÎÔÛÇ0-9 \t,;:()\-"]{7,130})\s+—\s+(.+)$/.exec(
          line,
        );
      if (mDash) {
        const head = mDash[1]!;
        const tail = mDash[2]!;
        if (labelLooksLikeShout(head)) {
          next.push(`### ${head} — ${tail}`);
          continue;
        }
      }
      const mTitle = /^([A-ZÁÉÍÓÚÃÕÂÊÎÔÛÇ0-9][A-ZÁÉÍÓÚÃÕÂÊÎÔÛÇ0-9 \t,;:()\-"]{7,130})\.$/.exec(line);
      if (mTitle && labelLooksLikeShout(mTitle[1]!)) {
        next.push(`### ${line}`);
        continue;
      }
    }
    next.push(block);
  }
  return next.join("\n\n");
}

function enhanceLessonChunk(md: string): string {
  if (!md.trim()) return md;
  return promotePedagogicalLabels(md.trim());
}

/** Listas: GFM quebra se houver linha em branco entre itens — compacta sem alterar texto. */
function tightenListSpacing(md: string): string {
  let prev = md;
  let next = md;
  const reBullet = /(^|\n)([ \t]*(?:[-*+]|[0-9]+\.)\s[^\n]+)\n\n([ \t]*(?:[-*+]|[0-9]+\.)\s)/g;
  do {
    prev = next;
    next = prev.replace(reBullet, "$1$2\n$3");
  } while (next !== prev);
  return next;
}

function buildLessonMarkdown(node: (typeof CANNABIS101_LESSON_NODES)[number], lessonIndex: number): string {
  const body = CANNABIS101_LESSON_BODIES[node.stableId];
  if (!body) throw new Error(`Corpo editorial em falta: ${node.stableId}`);

  const title = node.displayTitle;
  const description = descriptionFromClosing(body.closingSummary);

  const introRaw = body.introduction.trim();
  const introChunks = introRaw.split(/\n---\n/).map((c) => c.trim()).filter(Boolean);
  const introPartA = introChunks[0] ?? "";
  const introPartB =
    introChunks.length > 1 ? introChunks.slice(1).join("\n\n---\n\n").trim() : "";

  const objectivesMd =
    body.objectives.length > 0
      ? body.objectives.map((o) => `- ${o}`).join("\n")
      : "";

  const mainBody = body.body.trim();
  const mainDemoted = mainBody ? enhanceLessonChunk(demoteHeadings(mainBody)) : "";
  const introADemoted = introPartA ? enhanceLessonChunk(demoteHeadings(introPartA)) : "";
  const introBDemoted = introPartB ? enhanceLessonChunk(demoteHeadings(introPartB)) : "";

  const reflectionQ =
    CANNABIS101_REFLECTION_PROMPTS[node.stableId]?.trim() ?? body.quiz[0]?.question?.trim();
  const notes = body.professorNotes.trim();

  const parts: string[] = [];

  parts.push(`# ${title}`);
  parts.push("");

  if (introADemoted) {
    if (!blockStartsWithHeading(introADemoted)) {
      parts.push("## Introdução");
      parts.push("");
    }
    parts.push(introADemoted);
    parts.push("");
  }

  if (introBDemoted) {
    parts.push("---");
    parts.push("");
    parts.push("## Desenvolvimento");
    parts.push("");
    parts.push(introBDemoted);
    parts.push("");
  }

  if (objectivesMd) {
    parts.push("---");
    parts.push("");
    parts.push("## Objetivos de aprendizagem");
    parts.push("");
    parts.push(objectivesMd);
    parts.push("");
  }

  if (mainDemoted) {
    parts.push("---");
    parts.push("");
    parts.push("## Conteúdo principal");
    parts.push("");
    parts.push(mainDemoted);
    parts.push("");
  }

  parts.push("---");
  parts.push("");
  parts.push("## Resumo final");
  parts.push("");
  parts.push(body.closingSummary.trim());
  parts.push("");

  if (notes) {
    parts.push("---");
    parts.push("");
    parts.push("> **Nota do professor THCProce**");
    for (const line of notes.split("\n")) {
      parts.push(`> ${line}`.trimEnd());
    }
    parts.push("");
  }

  if (reflectionQ) {
    parts.push("---");
    parts.push("");
    parts.push("## Para refletir");
    parts.push("");
    for (const line of reflectionQ.split("\n")) {
      parts.push(`> ${line}`.trimEnd());
    }
    parts.push("");
  }

  let markdownBody = normalizeListMarkers(parts.join("\n").trim() + "\n");
  markdownBody = tightenListSpacing(compactBlankLines(collapseRedundantHrules(markdownBody)));

  const fm = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `lessonIndex: ${lessonIndex}`,
    `stableId: ${JSON.stringify(node.stableId)}`,
    "---",
    "",
    markdownBody,
  ].join("\n");

  return fm;
}

fs.mkdirSync(outDir, { recursive: true });

for (let i = 0; i < CANNABIS101_LESSON_NODES.length; i++) {
  const node = CANNABIS101_LESSON_NODES[i]!;
  const md = buildLessonMarkdown(node, i);
  const file = path.join(outDir, `${node.stableId}.md`);
  fs.writeFileSync(file, md, "utf8");
  console.log("wrote", path.relative(root, file));
}
