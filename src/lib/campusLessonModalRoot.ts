/**
 * Raiz única do modal de aula — fora da árvore do campus (sem overflow/isolate do mapa).
 * `z-index` e `isolation` vêm de `globals.css` (#campus-lesson-modal-root).
 */
export const CAMPUS_LESSON_MODAL_ROOT_ID = "campus-lesson-modal-root";

/** Client-only. */
export function getCampusLessonModalRoot(): HTMLElement {
  let el = document.getElementById(CAMPUS_LESSON_MODAL_ROOT_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = CAMPUS_LESSON_MODAL_ROOT_ID;
    document.body.appendChild(el);
  }
  return el;
}

/**
 * Garante que a raiz é o **último filho** de `document.body` enquanto a aula está aberta,
 * para empilhamento estável face a outros portais / extensões.
 */
export function mountCampusLessonModalRootToBodyEnd(): HTMLElement {
  const el = getCampusLessonModalRoot();
  document.body.appendChild(el);
  return el;
}
