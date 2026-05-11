/**
 * Pacotes editoriais opcionais ao lado de `overview.md` por hotspot do mapa.
 * Formato estável para expansão futura — não acoplado à BD nem stores.
 */

export type CampusMapPointQuizQuestion = {
  id: string;
  question: string;
  /** Quatro alternativas na ordem apresentada */
  options: [string, string, string, string];
  /** Índice 0–3 da correta */
  correctIndex: number;
};

export type CampusMapPointQuiz = {
  questions: [CampusMapPointQuizQuestion, CampusMapPointQuizQuestion];
};

export type CampusMapPointMission = {
  title: string;
  description: string;
  checklist: string[];
};

/** Nível de raridade da recompensa (copy/UI; futura persistência pode espelhar). */
export type CampusMapPointRewardRarity = "comum" | "raro" | "épico" | "lendário";

export type CampusMapPointRewards = {
  xp: number;
  greenCoins: number;
  growerMasterProgress: number;
  rarity?: CampusMapPointRewardRarity;
  badge: {
    id: string;
    name: string;
    description: string;
  };
};

export type CampusMapPointAmbience = {
  /** Frases curtas para contexto vivo / futuros HUD */
  lines?: string[];
};

/** Metadados extras do pacote (YAML do overview continua fonte principal da UI legada). */
export type CampusMapPointBundleMeta = {
  theme?: string;
  tags?: string[];
  difficulty?: string;
  category?: string;
  /** livre: ex. topic-hotspot, campus-service */
  areaType?: string;
  /** Slugs de `map-points/` sugeridos como pré-requisito lógico (sem navegação automática). */
  prerequisites?: string[];
  /** Áreas temáticas vizinhas para explorar. */
  relatedAreas?: string[];
  /** Próximo passo recomendado na jornada THCProce. */
  recommendedNext?: string[];
};

/**
 * Conteúdo sazonal modular — sem eventos ao vivo; prepara slots editoriais (calor, chuva, seca…).
 */
export type CampusMapPointSeasonalScenario = {
  id: string;
  label: string;
  summary: string;
  /** Slugs relacionados quando existirem materiais dedicados */
  relatedSlugs?: string[];
};

export type CampusMapPointSeasonal = {
  scenarios?: CampusMapPointSeasonalScenario[];
};
