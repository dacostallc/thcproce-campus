/**
 * Intro cinematográfica do campus — manifestos versionados para futuras intros por curso / temporada / evento.
 */

export const CAMPUS_CINEMATIC_INTRO_SEEN_LS_KEY = "thcproce.campus.introSeen.v1" as const;

export type CampusIntroCue = {
  startMs: number;
  endMs: number;
  text: string;
};

export type CampusIntroManifestV1 = {
  schemaVersion: 1;
  /** Identificador estável (ex.: campus-default, curso:cannabis-101, season:2026-q1). */
  id: string;
  /** Áudio por defeito relativo ao site público. */
  defaultAudioSrc: string;
  /** Legenda para leitor de ecrã / fallback sem áudio. */
  narratorLabel: string;
  cues: CampusIntroCue[];
};

/** Manifesto por defeito — ajustar tempos das cues quando o MP3 oficial estiver masterizado. */
export const CAMPUS_INTRO_MANIFEST_DEFAULT: CampusIntroManifestV1 = {
  schemaVersion: 1,
  id: "campus-default-v1",
  defaultAudioSrc: "/audio/thcproce-campus-intro.mp3",
  narratorLabel: "Professor THCProce",
  cues: [
    {
      startMs: 0,
      endMs: 4800,
      text: "Bem-vindo ao Campus THCProce — uma universidade viva, feita para quem quer aprender com rigor e responsabilidade."
    },
    {
      startMs: 4800,
      endMs: 9800,
      text: "Aqui o conhecimento não é um PDF frio: é rota, comunidade e ritmo — como num documentário que tu escolhes explorar."
    },
    {
      startMs: 9800,
      endMs: 14_800,
      text: "O mapa é o teu lugar de passagem: cada zona guarda trilhas, microaulas e desafios que constroem o teu percurso."
    },
    {
      startMs: 14_800,
      endMs: 19_800,
      text: "Respira fundo. Este espaço foi pensado para inspirar curiosidade — sem sensacionalismo, com ética e ciência."
    },
    {
      startMs: 19_800,
      endMs: 24_600,
      text: "Missões e presença contam quem está ligado ao campus; o cinema e as lives marcam o pulso colectivo da escola."
    },
    {
      startMs: 24_600,
      endMs: 29_400,
      text: "Avança ao teu ritmo: pausa quando precisares. O importante é manter a chama do aprendizado acesa."
    },
    {
      startMs: 29_400,
      endMs: 34_200,
      text: "Da primeira visita ao teu certificado, cada passo soma — XP, selos e histórico que te pertencem."
    },
    {
      startMs: 34_200,
      endMs: 39_000,
      text: "Estamos a construir esta experiência contigo. O campus cresce em temporadas — volta sempre que quiseres."
    },
    {
      startMs: 39_000,
      endMs: 44_000,
      text: "Quando estiveres pronto, entra no mapa. O Professor THCProce espera-te do outro lado da próxima descoberta."
    }
  ]
};

export function isCampusCinematicIntroFeatureEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_CINEMATIC_INTRO !== "false";
}

export function resolveCampusIntroAudioSrc(manifest: CampusIntroManifestV1): string {
  const env = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_CAMPUS_INTRO_AUDIO_SRC : undefined;
  const trimmed = typeof env === "string" ? env.trim() : "";
  if (trimmed.length > 0) return trimmed;
  return manifest.defaultAudioSrc;
}

export function getCampusIntroFallbackDurationMs(manifest: CampusIntroManifestV1): number {
  const last = manifest.cues[manifest.cues.length - 1];
  return last ? last.endMs + 1200 : 48_000;
}

export function hasCampusCinematicIntroBeenSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CAMPUS_CINEMATIC_INTRO_SEEN_LS_KEY) === "1";
  } catch {
    return false;
  }
}

export function markCampusCinematicIntroSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CAMPUS_CINEMATIC_INTRO_SEEN_LS_KEY, "1");
  } catch {
    /* quota */
  }
}
