/** localStorage: mostrar ou ocultar zonas / limites no mapa. */
export const CAMPUS_ZONE_BORDERS_LS_KEY = "thc-campus-zone-borders";

/**
 * Espaço de coordenadas dos polígonos e `labelPosition` (mesma escala que o mock numerado 01–17).
 * O SVG do mapa usa viewBox 0–100; converter com `pointsToSvg` em `campusZoneUtils`.
 */
export const CAMPUS_ZONE_ART_WIDTH = 1920;
export const CAMPUS_ZONE_ART_HEIGHT = 1080;

export type CampusZone = {
  number: string;
  id: string;
  label: string;
  description: string;
  areaType:
    | "cultivo"
    | "laboratorio"
    | "medicina"
    | "culinaria"
    | "social"
    | "logistica"
    | "entrada";
  color: string;
  glow: string;
  status: "active" | "locked" | "comingSoon";
  priority: number;
  /** IDs de áreas em `src/data/courses.ts` (hotspots / salas). */
  courseIds: string[];
  /**
   * Rota canónica quando não há `courseIds` ou quando `navigationUsesHref` no handler.
   * Rotas `/cursos/*` inventadas foram substituídas por `/` + painel via `courseIds`.
   */
  href: string;
  icon: string;
  labelPosition: { x: number; y: number };
  points: [number, number][];
};

export const CAMPUS_ZONES: CampusZone[] = [
  {
    number: "01",
    id: "estufas",
    label: "Estufas",
    description: "Estufas principais para cultivo controlado.",
    areaType: "cultivo",
    color: "#7CFF5B",
    glow: "rgba(124,255,91,0.55)",
    status: "active",
    priority: 1,
    courseIds: ["cultivo-greenhouse", "cannabis-101"],
    href: "/",
    icon: "greenhouse",
    labelPosition: { x: 410, y: 210 },
    points: [
      [180, 80],
      [660, 40],
      [780, 250],
      [520, 330],
      [190, 280]
    ]
  },
  {
    number: "02",
    id: "cultivo-outdoor",
    label: "Cultivo outdoor",
    description: "Cultivo ao ar livre em ambiente natural.",
    areaType: "cultivo",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.55)",
    status: "active",
    priority: 2,
    courseIds: ["cultivo-outdoor", "cannabis-101"],
    href: "/",
    icon: "tree",
    labelPosition: { x: 820, y: 165 },
    points: [
      [760, 70],
      [1030, 25],
      [1160, 160],
      [1080, 300],
      [790, 275],
      [700, 170]
    ]
  },
  {
    number: "03",
    id: "cultivo-indoor",
    label: "Cultivo indoor",
    description: "Salas de cultivo climatizado.",
    areaType: "cultivo",
    color: "#C55CFF",
    glow: "rgba(197,92,255,0.55)",
    status: "active",
    priority: 3,
    courseIds: ["cultivo-indoor"],
    href: "/",
    icon: "lamp",
    labelPosition: { x: 1165, y: 190 },
    points: [
      [1120, 75],
      [1460, 85],
      [1570, 230],
      [1500, 330],
      [1160, 315],
      [1040, 220]
    ]
  },
  {
    number: "04",
    id: "laboratorio",
    label: "Laboratório",
    description: "Laboratório de análises, pesquisa e desenvolvimento.",
    areaType: "laboratorio",
    color: "#22D3EE",
    glow: "rgba(34,211,238,0.55)",
    status: "active",
    priority: 4,
    courseIds: ["laboratorio"],
    href: "/",
    icon: "flask",
    labelPosition: { x: 1510, y: 190 },
    points: [
      [1440, 90],
      [1740, 80],
      [1850, 240],
      [1810, 360],
      [1530, 330],
      [1420, 230]
    ]
  },
  {
    number: "05",
    id: "extracao-oleo",
    label: "Extração óleo",
    description: "Processamento e extração de óleo.",
    areaType: "laboratorio",
    color: "#FACC15",
    glow: "rgba(250,204,21,0.55)",
    status: "active",
    priority: 5,
    courseIds: ["extracao-oleo"],
    href: "/",
    icon: "droplet",
    labelPosition: { x: 1345, y: 260 },
    points: [
      [1300, 210],
      [1390, 195],
      [1430, 260],
      [1395, 330],
      [1305, 315],
      [1265, 255]
    ]
  },
  {
    number: "06",
    id: "instituto-medicinal",
    label: "Instituto medicinal",
    description: "Pesquisa medicinal e estudos clínicos.",
    areaType: "medicina",
    color: "#60A5FA",
    glow: "rgba(96,165,250,0.55)",
    status: "active",
    priority: 6,
    courseIds: ["medicina"],
    href: "/",
    icon: "cross",
    labelPosition: { x: 1490, y: 305 },
    points: [
      [1435, 245],
      [1630, 245],
      [1665, 345],
      [1600, 400],
      [1430, 385],
      [1390, 310]
    ]
  },
  {
    number: "07",
    id: "sala-aula-cultivo",
    label: "Sala de aula cultivo",
    description: "Ensino de cultivo, técnicas e fundamentos.",
    areaType: "cultivo",
    color: "#2DD4BF",
    glow: "rgba(45,212,191,0.55)",
    status: "active",
    priority: 7,
    courseIds: ["cannabis-101"],
    href: "/",
    icon: "book-open",
    labelPosition: { x: 1655, y: 340 },
    points: [
      [1630, 300],
      [1790, 300],
      [1845, 375],
      [1770, 440],
      [1640, 415]
    ]
  },
  {
    number: "08",
    id: "estufas-apoio",
    label: "Estufas apoio",
    description: "Mudas, suporte técnico e preparação.",
    areaType: "cultivo",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.55)",
    status: "active",
    priority: 8,
    courseIds: ["genetica"],
    href: "/",
    icon: "sprout",
    labelPosition: { x: 595, y: 345 },
    points: [
      [510, 285],
      [720, 250],
      [820, 340],
      [745, 445],
      [520, 430],
      [455, 350]
    ]
  },
  {
    number: "09",
    id: "almoxarifado",
    label: "Almoxarifado",
    description: "Materiais, insumos e equipamentos.",
    areaType: "logistica",
    color: "#F472B6",
    glow: "rgba(244,114,182,0.55)",
    status: "active",
    priority: 9,
    courseIds: ["extracoes-solventless"],
    href: "/",
    icon: "boxes",
    labelPosition: { x: 470, y: 565 },
    points: [
      [260, 470],
      [610, 405],
      [790, 540],
      [620, 690],
      [250, 600]
    ]
  },
  {
    number: "10",
    id: "viveiro-de-mudas",
    label: "Viveiro de mudas",
    description: "Produção, seleção e manejo de mudas.",
    areaType: "cultivo",
    color: "#34D399",
    glow: "rgba(52,211,153,0.55)",
    status: "active",
    priority: 10,
    courseIds: ["genetica"],
    href: "/",
    icon: "leaf",
    labelPosition: { x: 800, y: 530 },
    points: [
      [710, 490],
      [875, 450],
      [950, 555],
      [875, 660],
      [710, 625],
      [650, 545]
    ]
  },
  {
    number: "11",
    id: "escola-culinaria",
    label: "Escola de culinária",
    description: "Gastronomia, infusões e culinária com cannabis.",
    areaType: "culinaria",
    color: "#EAB308",
    glow: "rgba(234,179,8,0.55)",
    status: "active",
    priority: 11,
    courseIds: ["culinaria"],
    href: "/",
    icon: "chef-hat",
    labelPosition: { x: 1030, y: 500 },
    points: [
      [850, 360],
      [1290, 330],
      [1490, 510],
      [1390, 720],
      [930, 700],
      [800, 520]
    ]
  },
  {
    number: "12",
    id: "sala-secagem",
    label: "Sala de secagem",
    description: "Secagem, cura e processamento pós-colheita.",
    areaType: "cultivo",
    color: "#FACC15",
    glow: "rgba(250,204,21,0.55)",
    status: "active",
    priority: 12,
    courseIds: ["secagem-cura"],
    href: "/",
    icon: "wind",
    labelPosition: { x: 1460, y: 470 },
    points: [
      [1405, 390],
      [1665, 405],
      [1635, 565],
      [1460, 610],
      [1365, 500]
    ]
  },
  {
    number: "13",
    id: "lounge-social",
    label: "Lounge social",
    description: "Convivência, comunidade e networking.",
    areaType: "social",
    color: "#A855F7",
    glow: "rgba(168,85,247,0.55)",
    status: "active",
    priority: 13,
    courseIds: ["cooperativismo"],
    href: "/",
    icon: "users",
    labelPosition: { x: 1090, y: 640 },
    points: [
      [980, 610],
      [1220, 590],
      [1260, 720],
      [1060, 775],
      [900, 700]
    ]
  },
  {
    number: "14",
    id: "area-de-cultivo",
    label: "Área de cultivo",
    description: "Cultivo experimental, pesquisa e prática.",
    areaType: "cultivo",
    color: "#A3E635",
    glow: "rgba(163,230,53,0.55)",
    status: "active",
    priority: 14,
    courseIds: ["cultivo-outdoor"],
    href: "/",
    icon: "plant",
    labelPosition: { x: 1660, y: 510 },
    points: [
      [1540, 410],
      [1835, 440],
      [1770, 620],
      [1510, 595]
    ]
  },
  {
    number: "15",
    id: "armazenamento",
    label: "Armazenamento",
    description: "Estoque, logística e conservação.",
    areaType: "logistica",
    color: "#F97316",
    glow: "rgba(249,115,22,0.55)",
    status: "active",
    priority: 15,
    courseIds: ["industria"],
    href: "/",
    icon: "warehouse",
    labelPosition: { x: 1565, y: 670 },
    points: [
      [1450, 620],
      [1740, 580],
      [1815, 760],
      [1550, 855],
      [1390, 745]
    ]
  },
  {
    number: "16",
    id: "praca-central",
    label: "Praça central",
    description: "Área de convivência, eventos e orientação.",
    areaType: "social",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.55)",
    status: "active",
    priority: 16,
    courseIds: ["cooperativismo", "cannabis-101"],
    href: "/",
    icon: "map-pin",
    labelPosition: { x: 950, y: 805 },
    points: [
      [850, 750],
      [1025, 730],
      [1090, 855],
      [940, 930],
      [800, 850]
    ]
  },
  {
    number: "17",
    id: "entrada-principal",
    label: "Entrada principal",
    description: "Acesso ao campus e início da jornada.",
    areaType: "entrada",
    color: "#EC4899",
    glow: "rgba(236,72,153,0.55)",
    status: "active",
    priority: 17,
    courseIds: ["legislacao", "cannabis-101"],
    href: "/",
    icon: "gate",
    labelPosition: { x: 600, y: 780 },
    points: [
      [500, 685],
      [675, 705],
      [700, 850],
      [535, 900],
      [460, 780]
    ]
  }
];
