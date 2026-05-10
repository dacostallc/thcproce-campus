/** Chaves localStorage do onboarding welcome + tour guiado — fonte única para progresso espelho. */

/**
 * Modal "Bem-vindo" resolvido: utilizador fechou/pulou o welcome **ou** concluiu o tour (último passo).
 * Não gravar ao clicar só em "Começar tour" — abandono antes de concluir mantém esta chave ausente para o welcome voltar.
 */
export const CAMPUS_WELCOME_MODAL_SEEN_LS_KEY = "thc_campus_welcome_modal_seen_v1" as const;

export const CAMPUS_TOUR_SEEN_LS_KEY = "thc_campus_tour_seen_v1" as const;

export const CAMPUS_GUIDED_TOUR_DONE_LS_KEY = "thc_campus_guided_tour_done_v1" as const;

export const CAMPUS_TOUR_NUDGE_DISMISSED_LS_KEY = "thc_campus_tour_nudge_dismissed_v1" as const;

/** Ocultar o chip «Comece aqui» apenas nesta aba até recarregar. */
export const CAMPUS_START_HERE_SESSION_HIDE_KEY = "thc_campus_start_here_hide_session_v1" as const;
