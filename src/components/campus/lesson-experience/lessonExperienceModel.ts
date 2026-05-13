/**
 * FASE 1 — Mapa (LessonPanel.tsx)
 *
 * Shell / layout (deve ficar estável):
 * - Portal → #campus-lesson-modal-root + createPortal
 * - AnimatePresence + backdrop + motion.div moldura (92vw / 88vh)
 * - Cabeçalho cromado: barra de progresso da área, nome do curso, ordinal da aula, título/sr-only, fechar
 * - Área scroll `data-lesson-scroll-root`: alerta construção, toolbar marcação (modo clássico), loaders, blocos de conteúdo
 *
 * Conteúdo (varia por fonte: DB / estático / repositório / Moodle):
 * - BlockRenderer (Prisma), LessonStaticReadingShell / ClassroomLessonView, CampusLessonVideo
 *
 * Navegação:
 * - onSelectLesson, clampedLesson, títulos (getLessonTitlesForArea); footer prev/next/sair (dentro do shell de leitura ou ClassroomLessonView)
 *
 * Progresso / HUD (dados + acções, não visual do mapa):
 * - doneSet, dwell, markCurrent, markSeen, cinematicHud (snapshot para LessonHud premium)
 * - Queries: lessonProgressMine, myProgress, staticLessonMarkdown, lessonFromDb, moodleLessonSnippet
 *
 * Regras só Cannabis 101:
 * - isCannabis101Room → skip DB primeiro; mission/hint effects; título “Janela do curso”; lessonNav + cinematicHud; cores toolbar
 *
 * Todos os cursos:
 * - dwell intervalo, mark toolbar, trail % na barra do cabeçalho, portal, accent panel, underConstruction
 */

import type { ReactNode } from "react";

/**
 * Variante resolvida no LessonPanel (`resolveLessonExperienceKind`).
 * A composição visual não muda entre variantes nesta fase — só o contrato e a extensibilidade futura.
 */
export type LessonExperienceAdapterKind =
  | "cannabis101-cinematic"
  | "classic"
  | "under-construction";

/** Navegação entre aulas (callbacks puros — sem lógica de curso no shell). */
export type LessonExperienceNavigation = {
  onPrevLesson: () => void;
  onNextLesson: () => void;
  onExitLesson: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
};

/** Saída do adapter `buildLessonExperienceSlots` — entrada direta do `LessonExperienceShell`. */
export type LessonExperienceSlots = {
  kind: LessonExperienceAdapterKind;
  chromeHeader: ReactNode;
  body: ReactNode;
};
