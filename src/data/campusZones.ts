import { CAMPUS_ART_HEIGHT, CAMPUS_ART_WIDTH } from "@/lib/campusArt";

/**
 * Converte vértices da arte de referência (dimensões em `campusArt`) em % do palco
 * (0–100, igual ao `viewBox` do SVG sobre a imagem).
 */
function p(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.round((x / CAMPUS_ART_WIDTH) * 10000) / 100,
    y: Math.round((y / CAMPUS_ART_HEIGHT) * 10000) / 100
  };
}

/** Requisitos para desbloquear a zona no mapa (fog of war). Ausente = sempre visível em cor. */
export type CampusZoneGate = {
  requiredCourse?: string;
  requiredXP?: number;
};

export type CampusZone = {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  courseSlug?: string;
  /** Outras salas/cursos na mesma zona (`Area.id` em `data/courses.ts`). */
  relatedSlugs?: string[];
  polygon: { x: number; y: number }[];
  gate?: CampusZoneGate;
  /** Entrada na calçada (calculado em `mapZones` se omitido). */
  entryPoint?: { x: number; y: number };
};

export const CAMPUS_ZONES: CampusZone[] = [
  {
    id: "estufas",
    name: "Estufas",
    description: "Estufas principais para cultivo controlado.",
    category: "Cultivo",
    color: "#7CFF5B",
    gate: { requiredCourse: "cannabis-101" },
    courseSlug: "cultivo-greenhouse",
    relatedSlugs: ["cannabis-101"],
    polygon: [
      p(180, 80),
      p(660, 40),
      p(780, 250),
      p(520, 330),
      p(190, 280)
    ]
  },
  {
    id: "cultivo-outdoor",
    name: "Cultivo outdoor",
    description: "Cultivo ao ar livre em ambiente natural.",
    category: "Cultivo",
    color: "#3B82F6",
    gate: { requiredCourse: "cannabis-101" },
    courseSlug: "cultivo-outdoor",
    relatedSlugs: ["cannabis-101"],
    polygon: [
      p(760, 70),
      p(1030, 25),
      p(1160, 160),
      p(1080, 300),
      p(790, 275),
      p(700, 170)
    ]
  },
  {
    id: "cultivo-indoor",
    name: "Cultivo indoor",
    description: "Salas de cultivo climatizado.",
    category: "Cultivo",
    color: "#C55CFF",
    gate: { requiredCourse: "cannabis-101" },
    courseSlug: "cultivo-indoor",
    polygon: [
      p(1120, 75),
      p(1460, 85),
      p(1570, 230),
      p(1500, 330),
      p(1160, 315),
      p(1040, 220)
    ]
  },
  {
    id: "laboratorio",
    name: "Laboratório",
    description: "Laboratório de análises, pesquisa e desenvolvimento.",
    category: "Laboratório",
    color: "#22D3EE",
    gate: { requiredCourse: "cannabis-101", requiredXP: 150 },
    courseSlug: "laboratorio",
    polygon: [
      p(1440, 90),
      p(1740, 80),
      p(1850, 240),
      p(1810, 360),
      p(1530, 330),
      p(1420, 230)
    ]
  },
  {
    id: "extracao-oleo",
    name: "Extração óleo",
    description: "Processamento e extração de óleo.",
    category: "Laboratório",
    color: "#FACC15",
    gate: { requiredCourse: "cannabis-101" },
    courseSlug: "extracao-oleo",
    polygon: [
      p(1300, 210),
      p(1390, 195),
      p(1430, 260),
      p(1395, 330),
      p(1305, 315),
      p(1265, 255)
    ]
  },
  {
    id: "instituto-medicinal",
    name: "Instituto medicinal",
    description: "Pesquisa medicinal e estudos clínicos.",
    category: "Medicina",
    color: "#60A5FA",
    gate: { requiredCourse: "cannabis-101", requiredXP: 280 },
    courseSlug: "medicina",
    polygon: [
      p(1435, 245),
      p(1630, 245),
      p(1665, 345),
      p(1600, 400),
      p(1430, 385),
      p(1390, 310)
    ]
  },
  {
    id: "sala-aula-cultivo",
    name: "Sala de aula cultivo",
    description: "Ensino de cultivo, técnicas e fundamentos.",
    category: "Cultivo",
    color: "#2DD4BF",
    courseSlug: "cannabis-101",
    polygon: [
      p(1630, 300),
      p(1790, 300),
      p(1845, 375),
      p(1770, 440),
      p(1640, 415)
    ]
  },
  {
    id: "estufas-apoio",
    name: "Estufas apoio",
    description: "Mudas, suporte técnico e preparação.",
    category: "Cultivo",
    color: "#F59E0B",
    gate: { requiredCourse: "cannabis-101" },
    courseSlug: "genetica",
    polygon: [
      p(510, 285),
      p(720, 250),
      p(820, 340),
      p(745, 445),
      p(520, 430),
      p(455, 350)
    ]
  },
  {
    id: "almoxarifado",
    name: "Almoxarifado",
    description: "Materiais, insumos e equipamentos.",
    category: "Logística",
    color: "#F472B6",
    gate: { requiredCourse: "cannabis-101" },
    courseSlug: "extracoes-solventless",
    polygon: [
      p(260, 470),
      p(610, 405),
      p(790, 540),
      p(620, 690),
      p(250, 600)
    ]
  },
  {
    id: "viveiro-de-mudas",
    name: "Viveiro de mudas",
    description: "Produção, seleção e manejo de mudas.",
    category: "Cultivo",
    color: "#34D399",
    gate: { requiredCourse: "cannabis-101" },
    courseSlug: "genetica",
    polygon: [
      p(710, 490),
      p(875, 450),
      p(950, 555),
      p(875, 660),
      p(710, 625),
      p(650, 545)
    ]
  },
  {
    id: "escola-culinaria",
    name: "Escola de culinária",
    description: "Gastronomia, infusões e culinária com cannabis.",
    category: "Culinária",
    color: "#EAB308",
    gate: { requiredCourse: "cannabis-101" },
    courseSlug: "culinaria",
    polygon: [
      p(850, 360),
      p(1290, 330),
      p(1490, 510),
      p(1390, 720),
      p(930, 700),
      p(800, 520)
    ]
  },
  {
    id: "sala-secagem",
    name: "Sala de secagem",
    description: "Secagem, cura e processamento pós-colheita.",
    category: "Cultivo",
    color: "#FACC15",
    gate: { requiredCourse: "cannabis-101" },
    courseSlug: "secagem-cura",
    polygon: [
      p(1405, 390),
      p(1665, 405),
      p(1635, 565),
      p(1460, 610),
      p(1365, 500)
    ]
  },
  {
    id: "lounge-social",
    name: "Lounge social",
    description: "Convivência, comunidade e networking.",
    category: "Social",
    color: "#A855F7",
    gate: { requiredCourse: "cannabis-101" },
    courseSlug: "cooperativismo",
    polygon: [
      p(980, 610),
      p(1220, 590),
      p(1260, 720),
      p(1060, 775),
      p(900, 700)
    ]
  },
  {
    id: "area-de-cultivo",
    name: "Área de cultivo",
    description: "Cultivo experimental, pesquisa e prática.",
    category: "Cultivo",
    color: "#A3E635",
    gate: { requiredCourse: "cannabis-101" },
    courseSlug: "cultivo-outdoor",
    polygon: [
      p(1540, 410),
      p(1835, 440),
      p(1770, 620),
      p(1510, 595)
    ]
  },
  {
    id: "armazenamento",
    name: "Armazenamento",
    description: "Estoque, logística e conservação.",
    category: "Logística",
    color: "#F97316",
    gate: { requiredCourse: "cannabis-101", requiredXP: 450 },
    courseSlug: "industria",
    polygon: [
      p(1450, 620),
      p(1740, 580),
      p(1815, 760),
      p(1550, 855),
      p(1390, 745)
    ]
  },
  {
    id: "praca-central",
    name: "Praça central",
    description: "Área de convivência, eventos e orientação.",
    category: "Social",
    color: "#3B82F6",
    courseSlug: "cooperativismo",
    relatedSlugs: ["cannabis-101"],
    polygon: [
      p(850, 750),
      p(1025, 730),
      p(1090, 855),
      p(940, 930),
      p(800, 850)
    ]
  },
  {
    id: "entrada-principal",
    name: "Entrada principal",
    description: "Acesso ao campus e início da jornada.",
    category: "Entrada",
    color: "#EC4899",
    courseSlug: "legislacao",
    relatedSlugs: ["cannabis-101"],
    polygon: [
      p(500, 685),
      p(675, 705),
      p(700, 850),
      p(535, 900),
      p(460, 780)
    ]
  }
];
