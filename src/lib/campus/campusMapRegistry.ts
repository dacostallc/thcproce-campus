/**
 * ## THCProce Campus — registo semântico do mapa (TypeScript)
 *
 * Este ficheiro é a **fonte de verdade declarativa** para:
 * - **Áreas grandes / “prédios”** (`course-area`, `cinema-area`, `live-area`, …): correspondem a **cursos completos**
 *   ou salas principais; no mapa final usam sobretudo **polígonos clicáveis**.
 * - **Hotspots menores** (`topic-hotspot`): **temas rápidos**, microconteúdo ou atalhos; usam **marcador** (ponto)
 *   ou polígonos pequenos quando refinarmos a arte.
 *
 * As **coordenadas `x`/`y` e polígonos** aqui são **placeholders em percentagem [0,100]**
 * relativos ao stage da imagem do campus — servem de base para alinhamento visual e tooling;
 * não substituem ainda o catálogo interactivo legado em `campusMapAreasCatalog.seed.ts`.
 *
 * @see {@link CAMPUS_MAP_REGISTRY_TO_LEGACY_HIT_ID} — ponte opcional para IDs do SVG/image-map actual.
 */

export type CampusPoint = {
  x: number;
  y: number;
};

export type CampusMapItemType =
  | "course-area"
  | "topic-hotspot"
  | "live-area"
  | "cinema-area"
  | "locked-area";

export type CampusMapItem = {
  id: string;
  type: CampusMapItemType;
  title: string;
  shortTitle?: string;
  description: string;
  polygon?: CampusPoint[];
  marker?: CampusPoint;
  linkedCourseId?: string;
  linkedLessonId?: string;
  href?: string;
  unlockLevel?: number;
  status: "available" | "coming-soon" | "locked";
  category:
    | "fundamentos"
    | "cultivo"
    | "extracao"
    | "medicina"
    | "legislacao"
    | "genetica"
    | "laboratorio"
    | "comunidade"
    | "evento";
};

/** Retângulo em % do stage (centro + meia largura/altura). */
function rectPolygon(
  cx: number,
  cy: number,
  halfW: number,
  halfH: number
): CampusPoint[] {
  return [
    { x: cx - halfW, y: cy - halfH },
    { x: cx + halfW, y: cy - halfH },
    { x: cx + halfW, y: cy + halfH },
    { x: cx - halfW, y: cy + halfH }
  ];
}

/**
 * Itens do mapa — áreas principais + hotspots educativos.
 * Refinar polígonos/marcadores quando a arte e o image-map forem migrados para este schema.
 */
export const CAMPUS_MAP_ITEMS: CampusMapItem[] = [
  /* ——— Áreas grandes (prédios / salas de curso) ——— */
  {
    id: "cannabis-101-campus",
    type: "course-area",
    title: "Cannabis 101",
    shortTitle: "C101",
    description:
      "Curso introdutório THCProce: planta, corpo, contexto legal e método — porta de entrada recomendada ao campus.",
    polygon: rectPolygon(42, 34, 9, 8),
    linkedCourseId: "cannabis-101",
    status: "available",
    category: "fundamentos"
  },
  {
    id: "cultivo-indoor",
    type: "course-area",
    title: "Cultivo Indoor",
    description:
      "Trilha dedicada a ambiente fechado, luz, clima e fluxo de trabalho — sala principal de cultivo indoor.",
    polygon: rectPolygon(72, 52, 10, 9),
    linkedCourseId: "cultivo-indoor",
    status: "coming-soon",
    category: "cultivo"
  },
  {
    id: "cultivo-outdoor-greenhouse",
    type: "course-area",
    title: "Cultivo Outdoor e Greenhouse",
    shortTitle: "Outdoor · Estufa",
    description:
      "Ciclos ao ar livre e protegidos: solo vivo, estufa e planeamento sazonal — mapa unificado deste eixo.",
    polygon: rectPolygon(28, 62, 11, 10),
    linkedCourseId: "cultivo-outdoor",
    status: "coming-soon",
    category: "cultivo"
  },
  {
    id: "laboratorio-extracao",
    type: "course-area",
    title: "Laboratório de Extração",
    shortTitle: "Extração",
    description:
      "Óleos, solventes e segurança laboratorial — espaço editorial para trilhas avançadas de extração.",
    polygon: rectPolygon(88, 24, 9, 8),
    linkedCourseId: "extracao-oleo",
    status: "coming-soon",
    category: "extracao"
  },
  {
    id: "viveiro-genetica",
    type: "course-area",
    title: "Viveiro e Genética",
    shortTitle: "Genética",
    description:
      "Seleção, estabilização e boas práticas de viveiro — núcleo da vertente genética do campus.",
    polygon: rectPolygon(76, 14, 9, 7),
    linkedCourseId: "genetica",
    status: "coming-soon",
    category: "genetica"
  },
  {
    id: "clinica-cannabis-medicinal",
    type: "course-area",
    title: "Cannabis Medicinal",
    shortTitle: "Medicinal",
    description:
      "Enquadramento clínico responsável, evidência e encaminhamento — sem substituir orientação médica.",
    polygon: rectPolygon(90, 38, 8, 8),
    linkedCourseId: "medicina",
    status: "coming-soon",
    category: "medicina"
  },
  {
    id: "biblioteca-legislacao",
    type: "course-area",
    title: "Biblioteca e Legislação",
    shortTitle: "Legislação",
    description:
      "Panorama normativo, leituras recomendadas e referências para navegar o contexto legal com rigor.",
    polygon: rectPolygon(40, 76, 10, 9),
    linkedCourseId: "legislacao",
    status: "coming-soon",
    category: "legislacao"
  },
  {
    id: "cinema-thcproce",
    type: "cinema-area",
    title: "Cinema THCProce",
    shortTitle: "Cinema",
    description:
      "Sessões especiais, lançamentos educativos e conteúdo longo — experiência tipo sala de cinema no campus.",
    polygon: rectPolygon(82, 86, 9, 8),
    status: "available",
    category: "evento"
  },
  {
    id: "arena-live",
    type: "live-area",
    title: "Arena Ao Vivo",
    shortTitle: "Ao vivo",
    description:
      "Eventos em tempo real, conversas com especialistas e momentos síncronos com a comunidade THCProce.",
    polygon: rectPolygon(52, 84, 9, 7),
    status: "available",
    category: "evento"
  },

  /* ——— Hotspots (temas rápidos / microconteúdo) ——— */
  {
    id: "pragas-e-doencas",
    type: "topic-hotspot",
    title: "Pragas e doenças",
    description:
      "Diagnóstico visual, prevenção de infestações e higiene de cultivo — micro-trilha de biosegurança.",
    marker: { x: 22, y: 58 },
    linkedCourseId: "cultivo-outdoor",
    status: "coming-soon",
    category: "cultivo"
  },
  {
    id: "sintomas-da-planta",
    type: "topic-hotspot",
    title: "Sintomas da planta",
    description:
      "Leitura foliar e sinais precoces de stress hídrico, luminoso ou nutricional.",
    marker: { x: 28, y: 52 },
    status: "coming-soon",
    category: "cultivo"
  },
  {
    id: "ph-ec-da-agua",
    type: "topic-hotspot",
    title: "pH e EC da água",
    description:
      "Condutividade, acidez e calibragem para soluções estáveis em hidroponia e solo inerte.",
    marker: { x: 34, y: 48 },
    status: "coming-soon",
    category: "cultivo"
  },
  {
    id: "nutrientes-npk",
    type: "topic-hotspot",
    title: "Nutrientes NPK",
    description:
      "Macronutrientes em vegetativo e floração — raciocínio editorial, não folha de campo comercial.",
    marker: { x: 40, y: 44 },
    status: "coming-soon",
    category: "cultivo"
  },
  {
    id: "calcio-magnesio",
    type: "topic-hotspot",
    title: "Cálcio e magnésio",
    description:
      "Papel dos secundários em estrutura foliar e fotossíntese; sintomas típicos e contexto educativo.",
    marker: { x: 46, y: 40 },
    status: "coming-soon",
    category: "cultivo"
  },
  {
    id: "tricomas",
    type: "topic-hotspot",
    title: "Tricomas",
    description:
      "Observação microscópica amadora e janelas de colheita orientadas ao uso responsável e à ciência.",
    marker: { x: 54, y: 38 },
    status: "coming-soon",
    category: "cultivo"
  },
  {
    id: "terpenos",
    type: "topic-hotspot",
    title: "Terpenos",
    description:
      "Química aromática da planta e interação com contextos sensoriais — base para aulas de perfil.",
    marker: { x: 60, y: 42 },
    status: "coming-soon",
    category: "medicina"
  },
  {
    id: "secagem-e-cura",
    type: "topic-hotspot",
    title: "Secagem e cura",
    description:
      "Fluxos de ar, humidade relativa e tempo — boas práticas de pós-colheita em linguagem didática.",
    marker: { x: 66, y: 46 },
    status: "coming-soon",
    category: "cultivo"
  },
  {
    id: "bubble-hash",
    type: "topic-hotspot",
    title: "Bubble hash",
    description:
      "Introdução solventless a frio — quadro educativo, não incentivo a produção ilegal.",
    marker: { x: 70, y: 34 },
    linkedCourseId: "extracoes-solventless",
    status: "coming-soon",
    category: "extracao"
  },
  {
    id: "rosin",
    type: "topic-hotspot",
    title: "Rosin",
    description:
      "Princípios mecânicos e térmicos da extração por pressão — conteúdo avançado THCProce.",
    marker: { x: 74, y: 31 },
    linkedCourseId: "extracoes-solventless",
    status: "coming-soon",
    category: "extracao"
  },
  {
    id: "piatella",
    type: "topic-hotspot",
    title: "Piatella",
    description:
      "Panorama editorial sobre formatos solventless contemporâneos — vínculo à trilha hashmaker.",
    marker: { x: 78, y: 28 },
    linkedCourseId: "extracoes-solventless",
    status: "coming-soon",
    category: "extracao"
  },
  {
    id: "endocannabinoide",
    type: "topic-hotspot",
    title: "Sistema endocannabinoide",
    description:
      "Pontes entre fisiologia humana e canabinoides — alinhado ao módulo Cannabis 101 e medicina.",
    marker: { x: 50, y: 28 },
    linkedCourseId: "cannabis-101",
    status: "coming-soon",
    category: "medicina"
  },
  {
    id: "anvisa-brasil",
    type: "topic-hotspot",
    title: "ANVISA — Brasil",
    description:
      "Leitura institucional de regulação sanitária — sempre sujeita a actualização; não é aconselhamento jurídico.",
    marker: { x: 38, y: 78 },
    status: "coming-soon",
    category: "legislacao"
  },
  {
    id: "receita-medica",
    type: "topic-hotspot",
    title: "Receita médica",
    description:
      "Marcos éticos e fluxos formais de prescrição — educação para diálogo com profissionais de saúde.",
    marker: { x: 44, y: 82 },
    status: "coming-soon",
    category: "medicina"
  },
  {
    id: "associacoes-cannabis",
    type: "topic-hotspot",
    title: "Associações de cannabis",
    description:
      "Papel das associações de pacientes e cooperativas no ecossistema regulado — contexto social.",
    marker: { x: 50, y: 86 },
    status: "coming-soon",
    category: "comunidade"
  }
];

export function getCampusMapItemById(id: string): CampusMapItem | undefined {
  return CAMPUS_MAP_ITEMS.find((item) => item.id === id);
}

export function getCampusMapItemsByType(type: CampusMapItemType): CampusMapItem[] {
  return CAMPUS_MAP_ITEMS.filter((item) => item.type === type);
}

export function getCampusMapItemsByCategory(
  category: CampusMapItem["category"]
): CampusMapItem[] {
  return CAMPUS_MAP_ITEMS.filter((item) => item.category === category);
}

export function getAvailableCampusMapItems(): CampusMapItem[] {
  return CAMPUS_MAP_ITEMS.filter(isCampusMapItemAvailable);
}

export function isCampusMapItemAvailable(item: CampusMapItem): boolean {
  return item.status === "available";
}

/**
 * Ponte para o catálogo **interactivo legado** (`CAMPUS_MAP_INTERACTIVE_AREAS` no seed).
 * Nem todo o {@link CAMPUS_MAP_ITEMS} tem correspondência 1:1 — ausência significa ainda não mapeado no SVG.
 */
export const CAMPUS_MAP_REGISTRY_TO_LEGACY_HIT_ID: Partial<Record<string, string>> = {
  "cannabis-101-campus": "curso-cultivo-101",
  "cultivo-indoor": "curso-cultivo-indoor",
  "cultivo-outdoor-greenhouse": "curso-cultivo-outdoor",
  "laboratorio-extracao": "curso-extracao-de-oleo",
  "viveiro-genetica": "curso-sementes-feminizadas",
  "clinica-cannabis-medicinal": "curso-aplicacoes-terapeuticas",
  "biblioteca-legislacao": "cannabis-e-proibida",
  "cinema-thcproce": "campus-cinema",
  "arena-live": "programacao-do-dia",
  "pragas-e-doencas": "curso-pragas-e-doencas",
  "bubble-hash": "curso-hashmaker",
  "rosin": "curso-hashmaker",
  "piatella": "curso-hashmaker"
};

/** Inverso útil para migrações futuras (hit legado → item semântico). */
export function getCampusRegistryIdFromLegacyHitId(
  legacyHitId: string
): string | undefined {
  const entry = Object.entries(CAMPUS_MAP_REGISTRY_TO_LEGACY_HIT_ID).find(
    ([, hit]) => hit === legacyHitId
  );
  return entry?.[0];
}
