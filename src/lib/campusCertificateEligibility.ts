import type { Area } from "@/data/courses";
import { getLessonTitlesForArea } from "@/data/lessonOutline";
import { getLessonRichContent } from "@/data/lessonRichContent";
import {
  readLessonDwellAccumulatedMs,
  readLessonQuizAttempt,
  lessonQuizAttemptStorageKey,
  buildInlineLessonQuizQuestionId
} from "@/lib/lessonAcademicPersistence";
import {
  computeLessonMinimumDwellMs,
  getLessonEstimatedMinutesForArea
} from "@/lib/lessonAcademicRules";
import { readLocalLessonMarks } from "@/lib/campusProgressStorage";

export type CampusCertificateEligibility = {
  eligible: boolean;
  reasons: string[];
};

/** Todas as aulas do índice 0..n-1 marcadas como concluídas localmente. */
function sequentialLessonMarks(areaId: string, lessonCount: number): boolean {
  if (lessonCount <= 0) return false;
  const marks = readLocalLessonMarks()[areaId] ?? [];
  const set = new Set(marks.map((x) => Math.floor(x)));
  for (let i = 0; i < lessonCount; i++) {
    if (!set.has(i)) return false;
  }
  return true;
}

function lessonQuizzesSatisfied(area: Area, lessonIndex: number): boolean {
  const titles = getLessonTitlesForArea(area);
  const title = titles[lessonIndex] ?? "";
  const rich = getLessonRichContent(area, lessonIndex, title);
  const quizzes = rich.quiz ?? [];
  if (!quizzes.length) return true;
  for (let qi = 0; qi < quizzes.length; qi++) {
    const q = quizzes[qi];
    if (!q) return false;
    const qid = buildInlineLessonQuizQuestionId(qi, q.question);
    const key = lessonQuizAttemptStorageKey(area.id, lessonIndex, qid);
    const att = readLessonQuizAttempt(key);
    if (!att || att.pickedIndex !== q.correctIndex) return false;
  }
  return true;
}

/**
 * Certificação local séria — pré-requisitos alinhados às regras académicas (`lessonAcademic*`).
 * Futuro: espelhar esta mesma função no servidor antes de emitir PDF oficial.
 */
export function evaluateCampusAreaCertificateEligibility(area: Area): CampusCertificateEligibility {
  const reasons: string[] = [];
  const titles = getLessonTitlesForArea(area);
  const n = titles.length;
  if (!n) {
    return { eligible: false, reasons: ["Área sem outline de aulas."] };
  }

  if (!sequentialLessonMarks(area.id, n)) {
    reasons.push(`Conclua todas as ${n} aulas por ordem (marcações locais).`);
  }

  for (let i = 0; i < n; i++) {
    const dwell = readLessonDwellAccumulatedMs(area.id, i);
    const min = computeLessonMinimumDwellMs(getLessonEstimatedMinutesForArea(area.id, i));
    if (dwell < min) {
      reasons.push(
        `Aula ${i + 1}: tempo mínimo na sala não atingido (${Math.ceil(min / 60000)} min efectivos).`
      );
    }
    if (!lessonQuizzesSatisfied(area, i)) {
      reasons.push(`Aula ${i + 1}: responda correctamente aos quizzes inline obrigatórios.`);
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons
  };
}
