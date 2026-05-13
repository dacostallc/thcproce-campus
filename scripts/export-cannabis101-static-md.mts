/**
 * One-shot helper legado: prefira `build-cannabis101-lesson-md.mts`
 * (diagramação + frontmatter completo).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lessonBodiesMod from "../src/content/courses/cannabis-101/lessonBodies.ts";
import lessonsMod from "../src/content/courses/cannabis-101/lessons.ts";

const { CANNABIS101_LESSON_BODIES } = lessonBodiesMod as {
  CANNABIS101_LESSON_BODIES: Record<
    string,
    {
      introduction: string;
      body: string;
      objectives: readonly string[];
      closingSummary: string;
    }
  >;
};
const { CANNABIS101_LESSON_NODES } = lessonsMod as {
  CANNABIS101_LESSON_NODES: readonly { stableId: string; displayTitle: string }[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "content", "courses", "cannabis-101", "lessons");

function mdSection(title: string, body: string): string {
  const t = body.trim();
  if (!t) return "";
  return `## ${title}\n\n${t}`;
}

for (const node of CANNABIS101_LESSON_NODES) {
  const body = CANNABIS101_LESSON_BODIES[node.stableId];
  if (!body) continue;
  const displayTitle = node.displayTitle;
  const intro = body.introduction.trim();
  const main = body.body.trim();
  const objectives =
    body.objectives.length > 0
      ? body.objectives.map((o) => `- ${o}`).join("\n")
      : "";
  const parts = [
    intro,
    mdSection("Objetivos", objectives),
    main ? main : "",
    mdSection("Para fechar", body.closingSummary.trim()),
  ].filter((p) => p && p.trim().length > 0);
  const md = parts.join("\n\n---\n\n");
  const fm = [
    "---",
    `title: ${JSON.stringify(displayTitle)}`,
    `lessonId: ${JSON.stringify(node.stableId)}`,
    `order: ${CANNABIS101_LESSON_NODES.findIndex((n) => n.stableId === node.stableId)}`,
    "---",
    "",
    md.trim(),
    "",
  ].join("\n");
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${node.stableId}.md`);
  fs.writeFileSync(file, fm, "utf8");
  console.log("wrote", path.relative(root, file));
}
