import type { LessonStreamContent } from "@/data/lessonContent/types";
import {
  cannabis101MoodleCourseUrl,
  CANNABIS101_EXPECTED_LESSON_TOTAL,
  CANNABIS101_MODULES,
  getCannabis101DisplayName,
  type Cannabis101Module
} from "./manifest";
import { CANNABIS101_LESSON_BODIES } from "./lessonBodies";

export type Cannabis101LessonNode = {
  readonly stableId: string;
  readonly moduleId: string;
  readonly sectionTitle: string;
  readonly activityLabel: string;
  readonly displayTitle: string;
};

function flattenModules(mods: readonly Cannabis101Module[]): Cannabis101LessonNode[] {
  const nodes: Cannabis101LessonNode[] = [];
  for (const mod of mods) {
    for (const leaf of mod.lessons) {
      nodes.push({
        stableId: leaf.id,
        moduleId: mod.id,
        sectionTitle: mod.title,
        activityLabel: leaf.activityLabel,
        displayTitle: `${mod.title} · ${leaf.activityLabel}`
      });
    }
  }
  return nodes;
}

export const CANNABIS101_LESSON_NODES: readonly Cannabis101LessonNode[] =
  flattenModules(CANNABIS101_MODULES);

function buildLesson(node: Cannabis101LessonNode): LessonStreamContent {
  const body = CANNABIS101_LESSON_BODIES[node.stableId];
  if (!body) {
    throw new Error(`Cannabis 101: falta conteúdo editorial para aula id «${node.stableId}»`);
  }

  const courseName = getCannabis101DisplayName();
  const url = cannabis101MoodleCourseUrl();

  return {
    title: node.displayTitle,
    introduction: body.introduction,
    body: body.body,
    objectives: body.objectives,
    closingSummary: body.closingSummary,
    quiz: body.quiz,
    media: body.media,
    materials: [
      `${courseName} — versão completa (vídeos longos, provas oficiais, PDF caprichados) na sala digital THCProce`,
      url
    ],
    references: [url],
    professorNotes: body.professorNotes
  };
}

export const CANNABIS101_LESSONS: readonly LessonStreamContent[] = (() => {
  const total = CANNABIS101_LESSON_NODES.length;
  if (total !== CANNABIS101_EXPECTED_LESSON_TOTAL) {
    throw new Error(`Cannabis 101: esperado ${CANNABIS101_EXPECTED_LESSON_TOTAL} itens, tem ${total}`);
  }
  return CANNABIS101_LESSON_NODES.map((node) => buildLesson(node));
})();

export const CANNABIS101_OUTLINE_TITLES: readonly string[] = CANNABIS101_LESSONS.map((l) => l.title);

export function getCannabis101LessonStableId(lessonIndex: number): string | undefined {
  return CANNABIS101_LESSON_NODES[lessonIndex]?.stableId;
}
